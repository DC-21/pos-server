const Sequelize = require("sequelize");
const db = require("../utils/db");

const Use = db.define("Use", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  accounttype: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false,
  },
  accountno: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  accountname: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  accountbalance: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  amounttopay: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: true,
  },
});

module.exports = Use;
