var express = require('express');
var auth = require('../utils/auth');
const db = require('../models/index');

var router = express.Router();
const Tasks = db['Tasks'];

router.use(auth.requireLogin);

router.get('/', function(req, res) {
    res.render('tasks');
});

// Create a new task
router.post('/', function(req, res) {
    const title = req.body.title.trim();
    const desc = req.body.desc.trim();
    let finishBy = req.body.finishBy.trim();
    const userId = req.user.id;

    if (title === '')
        return res.status(400).send('Task Title cannot be empty');
    if (finishBy === '')
        finishBy = null;

    const insert = 'INSERT INTO "Tasks" (title, descr, "finishBy", "userId") VALUES (?, ?, ?, ?) RETURNING id'
    return db.sequelize
        .query(insert, {
            replacements: [title, desc, finishBy, userId],
            type: db.sequelize.QueryTypes.INSERT,
        })
        .spread((results, metadata) => {
            const new_id = results[0].id;
            return res.send('Created new task with id: ' + new_id);
        })
        .catch(error => {
            console.log(error);
            res.status(400).send(error)
        });
});

module.exports = router;