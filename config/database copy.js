// const { Sequelize, DataTypes } = require('sequelize');

// const sequelize = new Sequelize('employeepf', 'root', 'root', {
//   host: 'localhost',
//   port: 3306,
//   dialect: 'mysql',
//   logging: true,
// });

// // Export sequelize and DataTypes to be used when loading models
// module.exports = { sequelize, DataTypes };



const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false
  }
);
module.exports = { sequelize, DataTypes };