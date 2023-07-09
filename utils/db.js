const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('businessdb', 'cholah', 'Cholah@2104', {
  host: 'db4free.net ',
  port: '3306',
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

module.exports = sequelize;
