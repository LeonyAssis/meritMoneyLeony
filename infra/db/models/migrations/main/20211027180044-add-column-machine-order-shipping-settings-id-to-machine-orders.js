'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('machine_orders', 'machine_order_shipping_setting_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'machine_order_shipping_id'
    }).then(() => {
      return queryInterface.addIndex('machine_orders', ['machine_order_shipping_setting_id']);
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('machine_orders', 'machine_order_shipping_setting_id');
  }
};
