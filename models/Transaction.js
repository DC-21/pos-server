const Sequelize = require("sequelize");
const db = require("../utils/db");

const Transaction = db.define("Transaction", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  receiptno: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  transaction_date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  accountname: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  accounttype: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  accountno: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  amountpaid: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  incomegroupcode: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = Transaction;
