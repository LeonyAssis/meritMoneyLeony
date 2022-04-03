'use strict';

module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define('machine_coil_stock_logs', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('received', 'sent'),
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gn_purchase_invoice: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    origin: {
      type: DataTypes.ENUM('Tiliform', 'Gerencianet'),
      allowNull: false
    },
    machine_client_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_id: {
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
