'use strict';

var bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
  }, {});

  User.hashPassword = function(password, saltRounds) {
    return bcrypt.hashSync(password, saltRounds);
  };

  User.prototype.checkPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  User.associate = function(models) {
    // associations can be defined here
  };
  
  return User;
};