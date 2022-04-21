'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('automatic_balance_config', { 
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    value: {
      type: DataTypes.INTEGER
    },
    day_to_send_balance: {
      type: DataTypes.INTEGER
    },
    last_user_set: {
      type: DataTypes.INTEGER,
      references: { model: 'users', key: 'id' },
    },
    created_at: DataTypes.DATE,   
    updated_at:  DataTypes.DATE
    
  }, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
