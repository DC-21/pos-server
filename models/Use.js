const Sequelize = require("sequelize");
const db = require("../utils/db");

const Use = db.define("Use", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: true,
  },
  receiptno: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false,
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
  receiptno: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false,
  },
  incomegroupcode: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: false,
  },
  paymenttype: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false,
  },
},
);

module.exports = Use;
