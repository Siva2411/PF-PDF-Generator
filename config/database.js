const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

const isProduction = process.env.NODE_ENV === 'production';
 
const dbFolder = isProduction ? '/data' : path.join(__dirname, '../data');
const dbPath = path.join(dbFolder, 'database.sqlite');

// Ensure the folder exists
if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder, { recursive: true });
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false
});

module.exports = sequelize;
