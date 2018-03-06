const db = require('../models/index');
const Users = db['User'];

module.exports = {
    create(req, res, next) {
        const saltRounds = 10;
        const email = req.body.email.trim();
        let password = req.body.password.trim();

        if (email === '' || password === '')
            return res.status(400).send('Invalid email or password');

        password = Users.hashPassword(password, saltRounds);
        const insert = 'INSERT INTO "Users" (email, password) VALUES (?, ?)';
        return db.sequelize
            .query(insert, { 
                replacements: [email, password], 
                // What does specifying type/raw do?
                type: db.sequelize.QueryTypes.INSERT,
                //raw: true 
            })
            // How do I get access to the object I just created?
            // Set session here.
            .then((response) => {
                console.log(response);
                next();
            })
            .catch(error => res.status(400).send(error));
    },
    verify(req, res, next) {
        const email = req.body.email.trim();
        const password = req.body.password.trim();

        if (email === '' || password === '')
            return res.status(400).send('Invalid email or password');

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
                    next(); 
                }
                else
                    return res.status(400).send('Invalid email or password');
            })
            .catch((error) => {
                console.log(error);
                res.status(400).send(error);
            });
    }
}