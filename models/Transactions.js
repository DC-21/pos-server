const Sequelize = require("sequelize");
const db = require("../utils/db");

const Transactions = db.define("Transactions", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  rcptno: {
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
  opn_bal: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  clsn_bal: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  amount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  amt_tnd: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  change: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  pymt_type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  desc: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  code: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = Transactions;