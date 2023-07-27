const Sequelize = require("sequelize");
const db = require("../utils/db");

const Customer = db.define("Customer", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  customerNo: {
    type: Sequelize.INTEGER,
    autoIncrement: false,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  address2: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phoneNo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  balanceDueLCY: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = Customer;
