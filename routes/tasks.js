var express = require('express');
var auth = require('../utils/auth');

var router = express.Router();

router.use(auth.requireLogin);

router.get('/', function(req, res) {
    res.send('Task List!');
});

module.exports = router;