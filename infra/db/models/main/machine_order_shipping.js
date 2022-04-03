'use strict';

module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define('machine_order_shipping', {
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
      allowNull: true
    },
    package_width: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    package_height: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    package_length: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    package_weight: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    shipment_price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    delivery_time: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    posted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    correios_label_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type_tracking_insertion: {
      type: DataTypes.ENUM('manual', 'automatic'),
      allowNull: true,
      defaultValue: 'manual'
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
