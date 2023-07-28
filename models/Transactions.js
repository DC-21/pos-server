const Sequelize = require("sequelize");
const db = require("../utils/db");

const Transactions = db.define("Transactions", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  receiptno: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  customer_no: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  opening_bal: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  closing_bal: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  amount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  payment_type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  income_group_code: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = Transactions;