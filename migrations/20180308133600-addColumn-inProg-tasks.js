'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'Tasks',
        'inProg',
        {
            type: Sequelize.BOOLEAN,
            allowNull: false
        }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Tasks', 'inProg');
  }
};