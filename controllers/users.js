const Users = require('../models').user;
const sequelize = require('../models/index').sequelize;

module.exports = {
    create(req, res) {
        // How do I create a raw query with parameters?
        const email = req.body.email.trim();
        const password = req.body.password.trim();

        if (email === '' || password === '')
            return res.status(400).send('Invalid email or password');

        const insert = `INSERT INTO "Users" (email, password) VALUES ('${email}', '${password}')`;
        return sequelize
            .query(insert, { model: Users })
            .then(new_user => res.status(201).send(new_user))
            .catch(error => res.status(400).send(error));
    },
}