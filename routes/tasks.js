var express = require('express');
var auth = require('../utils/auth');

var router = express.Router();

router.use(auth.requireLogin);

router.get('/', function(req, res) {
    res.render('tasks');
});

router.post('/', function(req, res) {
    console.log(req.body);
    res.send('Successfully added a task!');
});

module.exports = router;