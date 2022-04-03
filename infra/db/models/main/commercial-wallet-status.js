'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('commercial_wallet_status', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    commercial_wallet_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    commercial_wallet_status_type_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  },
    {
      freezeTableName: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
};
