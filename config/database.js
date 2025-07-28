// src/database.js (or wherever your DB config is)
const { Sequelize } = require('sequelize');
const path = require('path');

const dbPath = process.env.NODE_ENV === 'production'
  ? '/data/database.sqlite'
  : path.join(__dirname, '../data/database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false
});

module.exports = sequelize; // <- Make sure this is here!
