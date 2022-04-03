'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('machine_order_shipping', 'type_tracking_insertion', {
      type: Sequelize.ENUM('manual', 'automatic'),
      allowNull: true,
      defaultValue: 'manual',
      after: 'correios_label_id'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('machine_order_shipping', 'type_tracking_insertion');
  }
};
