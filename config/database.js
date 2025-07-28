const { Sequelize } = require('sequelize');
const path = require('path');

// Define SQLite file path
const dbPath = process.env.NODE_ENV === 'production'
  ? '/data/database.sqlite' // For Render (use persistent disk)
  : path.join(__dirname, '../data/database.sqlite'); // For local development

// Create Sequelize instance with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false // Optional: disable SQL query logging
});

module.exports = sequelize;
