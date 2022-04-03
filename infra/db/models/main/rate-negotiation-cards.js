'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('rate_negotiation_cards', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    rate_negotiations_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    payment_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    requested_rate: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rate_fixed: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    expected_receipts: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    availability_time: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    interest_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    interest_rate: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    max_shares: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_without_interest: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    min_value: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rate_negotiation_config_status_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    approver_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    approvation_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });
};
