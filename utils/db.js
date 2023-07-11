const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("postgres://default:gG6RdhBjcl5M@ep-round-sea-185823-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb");

module.exports = sequelize;
