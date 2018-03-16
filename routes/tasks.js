var express = require('express');
var auth = require('../utils/auth');
const db = require('../models/index');

var router = express.Router();
const Tasks = db['Tasks'];

router.use(auth.requireLogin);

// Display user tasks
router.get('/', function(req, res) {
    const userId = req.user.id;
    const select = 'SELECT * FROM "Tasks" WHERE "userId"=?';
    return db.sequelize
    .query(select, { 
        replacements: [userId], 
        model: Tasks,
    })
    .then((tasks) => {
        res.render('tasks', { 'tasklist': tasks[0] });
    })
    .catch((error) => {
        console.log(error);
        res.status(400).send(error);
    });
});

// Create a new task
router.post('/', function(req, res) {
    const title = req.body.title.trim();
    const description = req.body.desc.trim();
    let finishBy = req.body.finishBy.trim();
    const userId = req.user.id;
    const inProg = req.body.inProg.trim();

    if (title === '')
        return res.status(400).send('Task Title cannot be empty');
    if (finishBy === '')
        finishBy = null;

    const insert = 'INSERT INTO "Tasks" (title, description, "finishBy", "userId", "inProg") VALUES (?, ?, ?, ?, ?) RETURNING id'
    return db.sequelize
        .query(insert, {
            replacements: [title, description, finishBy, userId, inProg],
            type: db.sequelize.QueryTypes.INSERT,
        })
        .spread((results, metadata) => {
            const new_id = results[0].id;
            const select = 'SELECT * FROM "Tasks" WHERE id = ?'
        
            return db.sequelize
            .query(select, {
                replacements: [new_id],
                model: Tasks,
            })
            .then((response) => {
                return res.send(response[0][0]);
            })
            .catch((error) => {
                console.log(error);
                return res.status(501).send(error);
            });
        })
        .catch(error => {
            console.log(error);
            res.status(501).send(error);
        });
});

// Delete a task
router.delete('/:id', function(req, res) {
    const del = 'DELETE FROM "Tasks" WHERE id = ?';
    return db.sequelize
        .query(del, {
            replacements: [req.params.id.trim()],
            type: db.sequelize.QueryTypes.DELETE,
        })
        .then((response) => res.send("Successful delete"))
        .catch((error) => {
            console.log(error);
            res.status(501).send(error);
        });
});

// Toggle a task's progress
router.patch('/:id/inProg', function(req, res) {
    const update = 'UPDATE "Tasks" SET "inProg" = ? WHERE id = ?'
    let   inProg = (req.body.inProg === 'true' ? false : true);
    return db.sequelize
        .query(update, {
            replacements: [inProg, req.params.id.trim()],
            type: db.sequelize.QueryTypes.PATCH
        })
        .then((response) => res.send())
        .catch((error) => {
            console.log(error);
            res.status(501).send(error);
        });
});

module.exports = router;