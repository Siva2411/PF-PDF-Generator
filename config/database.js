const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

// Use a local 'data' folder in all environments
const dbFolder = path.join(__dirname, '..', 'data');
const dbPath = path.join(dbFolder, 'database.sqlite');

// Ensure the folder exists
if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder, { recursive: true });
}

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false // Set to true if you want SQL logs
});

module.exports = sequelize;