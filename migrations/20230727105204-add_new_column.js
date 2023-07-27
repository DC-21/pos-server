module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Customers', 'phoneNo', {
      type: Sequelize.STRING,
      allowNull: true, // Modify as needed based on your requirements
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Customers', 'phoneNo');
  }
};
