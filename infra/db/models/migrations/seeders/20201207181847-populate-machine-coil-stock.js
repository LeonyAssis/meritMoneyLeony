'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('machine_coil_stock', [{
      available_quantity: 0,
      quantity_received: 0,
      quantity_sent: 0,
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('machine_coil_stock', null, {});
  }
};
