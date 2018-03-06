var express = require('express');
var router = express.Router();
const userController = require('../controllers').users;

// Login routes
router.get('/auth', function(req, res) {
  res.render('auth');
});

router.post('/login', userController.verify, function(req, res) {
  res.send('Login post');
});

router.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/auth');
});

router.post('/user', userController.create, function(req, res) {
  res.redirect('/tasks');
});

module.exports = router;
