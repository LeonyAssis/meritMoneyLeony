'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('commercial_wallet_status_types', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  },
    {
      freezeTableName: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: false
    });
};
