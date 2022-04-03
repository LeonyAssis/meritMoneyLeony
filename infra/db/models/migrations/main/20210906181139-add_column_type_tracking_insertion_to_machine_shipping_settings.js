'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('machine_shipping_settings', 'type_tracking_insertion', {
      type: Sequelize.ENUM('manual', 'automatic'),
      allowNull: false,
      defaultValue: 'manual',
      after: 'calc_time_and_cost'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('machine_shipping_settings', 'type_tracking_insertion');
  }
};
