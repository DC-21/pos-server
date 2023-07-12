const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('businessDB', 'Cholah', 'Cholah@2104', {
  host: 'localhost',
  dialect: 'mysql',
});
module.exports = sequelize;
