'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('automatic_balance_execution_user_history', { 
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: { model: 'users', key: 'id' },
    },
    automatic_balance_id: {
      type: DataTypes.INTEGER,
      references: { model: 'automatic_balance_execution_status', key: 'id' },
    },   
    created_at: DataTypes.DATE,   
    updated_at:  DataTypes.DATE
    
  }, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
