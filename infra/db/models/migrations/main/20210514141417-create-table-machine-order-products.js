'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('machine_order_products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      price: {
        type: DataTypes.INTEGER,
      },
      discount: {
        type: DataTypes.INTEGER
      },
      acquisition_type: {
        type: DataTypes.ENUM('buy', 'rent'),
        allowNull: false,
      },
      machine_order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      machine_model_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      machine_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      return migration.addIndex('machine_order_products', ['machine_order_id']);
    }).then(() => {
      return migration.addIndex('machine_order_products', ['machine_id']);
    }).then(() => {
      return migration.addIndex('machine_order_products', ['machine_model_id']);
    });
  },

  down: (migration) => {
    return migration.dropTable('machine_order_products');
  }
};
