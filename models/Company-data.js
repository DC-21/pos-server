const Sequelize = require("sequelize");
const db = require("../utils/db");

const CompanyData = db.define("CompanyData", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  Name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Address: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Post_Address: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Telephone: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Fax: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  Email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = CompanyData;
