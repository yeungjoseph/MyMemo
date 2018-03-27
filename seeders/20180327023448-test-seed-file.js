'use strict';
const db = require('../models/index');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
    .query('INSERT INTO "Users" (email, password) VALUES (?, ?)', {
      replacements: ['test@test.com', db.User.hashPassword('test')],
      type: db.sequelize.QueryTypes.INSERT
    })
    .then(users => {})
    .catch(err => console.log(err));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
    .query('DELETE FROM "Users" WHERE email = "test@test.com"')
    .then(response => {})
    .catch(err => console.log(err));
  }
};
