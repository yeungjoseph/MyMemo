var express = require('express');
var router = express.Router();
const userController = require('../controllers').users;

// Login routes
router.get('/auth', function(req, res, next) {
  res.render('auth');
});

router.post('/login', function(req, res) {
  console.log(req.body);
  res.send('Login post');
});

router.post('/user', userController.create);

module.exports = router;
