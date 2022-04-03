'use strict';

module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define('machine_coil_stock', {
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
    quantity_sent: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity_received: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
