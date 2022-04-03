'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    await queryInterface.changeColumn('machines', 'business_type', {
      type: Sequelize.ENUM('buy', 'rent', 'trial'),
      allowNull: true
    }, {
      transaction
    });
  },


  down: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    await queryInterface.changeColumn('machines', 'business_type', {
      type: Sequelize.ENUM('buy', 'rent', 'trial'),
      allowNull: false
    }, {
      transaction
    });
  }
};
