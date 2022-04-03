'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('commercial_wallets', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    profile_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    document_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    document: {
      allowNull: false,
      type: DataTypes.STRING
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING
    },
    reference_value: {
      allowNull: true,
      type: DataTypes.STRING
    },
    responsible_analyst: {
      allowNull: true,
      type: DataTypes.STRING
    },
    commercial_size: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
    is_special: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    name: {
      allowNull: true,
      type: DataTypes.STRING
    },
    status_analyses: {
      allowNull: true,
      type: DataTypes.STRING
    },
    revaluation: {
      allowNull: true,
      type: DataTypes.DATEONLY
    },
    impact_factor: {
      allowNull: true,
      type: DataTypes.FLOAT
    },
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    updated_commercial_size_at: DataTypes.DATE,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
