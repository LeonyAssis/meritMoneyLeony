'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('machine_orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      machine_client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      suggestion_carrier_chip: {
        type: DataTypes.STRING(45),
      },
      amount_products: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('open', 'awaiting_shipping', 'done'),
        defaultValue: 'open',
        allowNull: false,
      },
      machine_order_address_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      machine_order_shipping_id: {
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        type: DataTypes.DATE
      }
    }).then(() => {
      return migration.addIndex('machine_orders', ['machine_client_id']);
    }).then(() => {
      return migration.addIndex('machine_orders', ['machine_order_address_id']);
    }).then(() => {
      return migration.addIndex('machine_orders', ['machine_order_shipping_id']);
    });
  },

  down: (migration) => {
    return migration.dropTable('machine_orders');
  }
};
