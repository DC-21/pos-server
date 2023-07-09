'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Transactions", "createdAt");
    await queryInterface.removeColumn("Transactions", "updatedAt");
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Transactions", "createdAt", {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.addColumn("Transactions", "updatedAt", {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
};
