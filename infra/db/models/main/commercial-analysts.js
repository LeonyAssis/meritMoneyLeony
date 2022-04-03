'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('commercial_analysts', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: true,
      type: DataTypes.STRING
    },
    small: {
      allowNull: true,
      type: DataTypes.STRING
    },
    normal: {
      allowNull: true,
      type: DataTypes.STRING
    },
    larger: {
      allowNull: true,
      type: DataTypes.STRING
    },
    special_accounts: {
      allowNull: true,
      type: DataTypes.STRING
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
