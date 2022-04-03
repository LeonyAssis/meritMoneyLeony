'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('account_new_rates', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    account: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    old_rate: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    new_rate: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    executed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    input: {
      type: DataTypes.JSON,
      allowNull: true
    },
    output: {
      type: DataTypes.JSON,
      allowNull: true
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    balancing: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
