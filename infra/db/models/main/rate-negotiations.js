'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('rate_negotiations', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    profile_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    document: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    input_channel: {
      type: DataTypes.STRING,
      allowNull: false
    },
    input_channel_reference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rate_negotiation_status_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rate_negotiation_reasons_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    responsible_user_id: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    assigned_responsible_at: {
      allowNull: true,
      type: DataTypes.DATE
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    observation: {
      type: DataTypes.TEXT,
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
