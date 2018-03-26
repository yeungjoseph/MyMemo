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
        model: Tasks
    })
    .then((tasks) => {
        res.render('tasks', { 'tasklist': tasks[0] });
    })
    .catch((error) => {
        console.log(error);
        res.status(500).send(error);
    });
});

// Search tasks
router.get('/search', function(req, res) {
    const userId = req.user.id;
    const searchBy = req.query.search.trim();
    const select = 'SELECT * FROM "Tasks" WHERE (title LIKE :search OR description LIKE :search) AND "userId" = :userId';
    return db.sequelize
    .query(select, {
        replacements: { search: '%' + searchBy + '%', userId: userId },
        model: Tasks
    })
    .then(tasks => {
        res.send(tasks[0]);
    })
    .catch(error => {
        console.log(error);
        res.status(500).send(error);
    })
});

// Search tasks by date
router.get('/searchdate', function(req, res) {
    const userId = req.user.id;
    let searchBy = req.query.search.trim();
    if (searchBy) {
        const select = 'SELECT * FROM "Tasks" WHERE "finishBy" = ? AND "userId" = ?';
        return db.sequelize
        .query(select, {
            replacements: [ searchBy, userId ],
            model: Tasks
        })
        .then(tasks => {
            res.send(tasks[0]);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
    }
    else {
        const select = 'SELECT * FROM "Tasks" WHERE "finishBy" IS NULL AND "userId" = ?';
        return db.sequelize
        .query(select, {
            replacements: [ userId ],
            model: Tasks
        })
        .then(tasks => {
            res.send(tasks[0]);
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
    }
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
    console.log(insert);
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
                model: Tasks
            })
            .then((response) => {
                return res.send(response[0][0]);
            })
            .catch((error) => {
                console.log(error);
                return res.status(500).send(error);
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        });
});

// Delete a task
router.delete('/:id', function(req, res) {
    const del = 'DELETE FROM "Tasks" WHERE id = ?';
    return db.sequelize
        .query(del, {
            replacements: [req.params.id.trim()],
            //type: db.sequelize.QueryTypes.DELETE,
        })
        .then(response => {
            if (response[1].rowCount > 0)
                res.json({ success: true });
            else  
                res.status(404).json({ success: false });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error);
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
        .then(response => {
            if (response[1].rowCount > 0)
                res.json({ success: true });
            else  
                res.status(404).json({ success: false });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error);
        });
});

router.patch('/:id', function(req ,res) {
    const title = req.body.title.trim();
    const description = req.body.desc.trim();
    let finishBy = req.body.finishBy.trim();
    const taskId = req.params.id.trim();
    if (title === '')
        return res.status(400).send('Task Title cannot be empty');
    if (finishBy === '')
        finishBy = null;

    const update = 'UPDATE "Tasks" SET "title" = ?, "description" = ?, "finishBy" = ? WHERE id = ?'

    return db.sequelize
        .query(update, {
            replacements: [title, description, finishBy, taskId],
            type: db.sequelize.QueryTypes.PATCH
        })
        .then(response => {
            if (response[1].rowCount > 0)
                res.json({ success: true });
            else  
                res.status(404).json({ success: false });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error);
        });
});

module.exports = router;