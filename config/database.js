const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('employeepf', 'root', 'root', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
  logging: true,
});

// Export sequelize and DataTypes to be used when loading models
module.exports = { sequelize, DataTypes };