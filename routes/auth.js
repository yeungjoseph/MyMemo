var express = require('express');
var router = express.Router();

// Login routes
router.get('/auth', function(req, res, next) {
  res.render('auth');
});

router.post('/login', function(req, res) {
  res.send('Login post')
});

router.post('/user', function(req, res) {
  res.send('Create a new user');
});

module.exports = router;
