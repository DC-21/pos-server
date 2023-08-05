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
    type: Sequelize.DECIMAL(10, 2),
    allowNull: true,
  },
  clsn_bal: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: true,
  },
  amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  amt_tnd: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  change: {
    type: Sequelize.DECIMAL(10, 2),
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
  Post: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  timestamps: false,
});

module.exports = Transactions;