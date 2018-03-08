'use strict';

module.exports = (sequelize, DataTypes) => {
  var Task = sequelize.define('Task', {
    title: DataTypes.STRING,
    desc: DataTypes.STRING,
    finishBy: DataTypes.DATE
  }, {});

  Task.associate = function(models) {
    // associations can be defined here
  };
  return Task;
};