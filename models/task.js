'use strict';

module.exports = (sequelize, DataTypes) => {
  var Task = sequelize.define('Task', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    finishBy: DataTypes.DATEONLY
  }, {});

  Task.associate = function(models) {
    // associations can be defined here
  };
  return Task;
};