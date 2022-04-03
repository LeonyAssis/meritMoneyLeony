'use strict';

module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define('machine_orders', {
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
    amount_products: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    suggestion_carrier_chip: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('open', 'awaiting_invoice', 'awaiting_shipping', 'done', 'canceled'),
      defaultValue: 'open',
      allowNull: false
    },
    machine_order_address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    machine_order_shipping_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    machine_order_shipping_setting_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    linked_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    invoice_uploaded_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    concluded_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    canceled_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    linked_at: DataTypes.DATE,
    invoice_uploaded_at: DataTypes.DATE,
    concluded_at: DataTypes.DATE,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
