'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('machine_coil_stock', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      available_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      quantity_received: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      quantity_sent: {
        type: DataTypes.INTEGER,
        allowNull: false
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
    });
  },
  down: (migration) => {
    return migration.dropTable('machine_coil_stock');
  }
};
