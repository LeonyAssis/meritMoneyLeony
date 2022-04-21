'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('automatic_balance_execution_status', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    choose_date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    },
    value: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.ENUM,
      values: [
        'EXECUTING',
        'PENDING',
        'FINISHED',
        'ERROR'
      ],
    },
    error_users: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

  }, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
