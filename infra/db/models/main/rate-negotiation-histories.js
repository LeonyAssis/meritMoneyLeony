'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('rate_negotiation_histories', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    rate_negotiation_billets_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rate_negotiation_cards_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rate_negotiation_pix_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rate_negotiation_bankings_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rate_negotiation_config_status_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    analyst_rate: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    data_alter: {
      type: DataTypes.JSON,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
