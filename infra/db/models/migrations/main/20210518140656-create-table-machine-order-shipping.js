'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('machine_order_shipping', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      tracking_code: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      company: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      package_width: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      package_height: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      package_length: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      package_weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      shipment_price: {
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
    });
  },


  down: (migration) => {
    return migration.dropTable('machine_order_shipping');
  }
};
