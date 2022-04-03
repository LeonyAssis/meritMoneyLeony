'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    await queryInterface.changeColumn('machine_orders', 'status', {
      type: Sequelize.ENUM('open', 'awaiting_invoice', 'awaiting_shipping', 'done'),
      defaultValue: 'open',
      allowNull: false
    }, {
      transaction
    });
  },


  down: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    await queryInterface.changeColumn('machine_orders', 'status', {
      type: Sequelize.ENUM('open', 'awaiting_shipping', 'done'),
      defaultValue: 'open'
    }, {
      transaction
    });
  }
};
