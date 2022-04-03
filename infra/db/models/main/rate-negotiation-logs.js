'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('rate_negotiation_logs', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    rate_negotiations_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    executer_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
