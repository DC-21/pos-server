const Sequelize = require("sequelize");
const db = require("../utils/db");

const Income_groups = db.define("Income_groups", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  income_group: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  timestamps: false,
});

module.exports = Income_groups;
