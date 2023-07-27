const Sequelize = require("sequelize");
const db = require("../utils/db");

const Income_groups = db.define("Income_groups", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  group_code: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  income_group: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = Income_groups;
