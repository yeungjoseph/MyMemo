var express = require('express');
var auth = require('../utils/auth');

var router = express.Router();

router.use(auth.requireLogin);

router.get('/', function(req, res) {
    res.render('tasks');
});

module.exports = router;