const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const User = db.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  }, 
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  } 
});

module.exports = User;