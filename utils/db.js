const sequelize = new sequelize('businessDB', 'Cholah', 'Cholah@2104', {
  host: 'localhost',
  dialect: 'mysql',
});
module.exports = sequelize;