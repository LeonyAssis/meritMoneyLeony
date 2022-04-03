'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('commercial_wallet_performance_tracking', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    commercial_wallet_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    receipt_number: {
      type: DataTypes.FLOAT.UNSIGNED,
      allowNull: false
    },
    total_amount: {
      type: DataTypes.FLOAT.UNSIGNED,
      allowNull: false
    },
    reference_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    variation: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

};
