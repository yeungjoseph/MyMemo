var express = require('express');
const db = require('../models/index');

var router = express.Router();
const Users = db['User'];

// Login and registration page
router.get('/auth', function(req, res) {
  res.render('auth');
});

router.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/auth');
});

// Login route
router.post('/login',  function(req, res) {
  const email = req.body.email.trim();
  const password = req.body.password;

  if (email === '' || password.trim() === '')
      return res.status(401).send('Invalid email or password');

  const select = 'SELECT * FROM "Users" WHERE email = ?';
  return db.sequelize
    .query(select, { 
        replacements: [email], 
        model: Users,
    })
    .then((response) => {
        if (response[0] !== undefined && response[0].checkPassword(password))
        {
            req.session.user = response[0];
            // return res.redirect('/tasks'); 
            res.status(200).end();
        }
        else 
          return res.status(401).send('Invalid email or password');
    })
    .catch((error) => {
        console.log(error);
        res.status(500).send(error);
    });
});

// Registration route
router.post('/user',function(req, res) {
  const email = req.body.email.trim();
  let password = req.body.password.trim();

  if (email === '' || password === '')
      return res.status(401).send('Invalid email or password');

  password = Users.hashPassword(password);
  const insert = 'INSERT INTO "Users" (email, password) VALUES (?, ?) RETURNING id';
  
  return db.sequelize
    .query(insert, { 
        replacements: [email, password], 
        type: db.sequelize.QueryTypes.INSERT,
    })
    .spread((results, metadata) => {
        const new_id = results[0].id;
        const select = 'SELECT * FROM "Users" WHERE id = ?'
        
        return db.sequelize
          .query(select, {
            replacements: [new_id],
            model: Users,
          })
          .then((response) => {
            req.session.user = response[0];
            return res.redirect('/tasks');
          })
          .catch((error) => {
            console.log(error);
            return res.status(500).send(error);
          });
    })
    .catch(error => {
      console.log(error);
      res.status(500).send(error)
    });
});

module.exports = router;
