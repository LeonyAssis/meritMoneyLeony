'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('benefits', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    brand: {
      type: DataTypes.STRING,     
    },
    company: {
      type: DataTypes.STRING,     
    },
    text: {
      type: DataTypes.STRING,     
    },
    value: {
      type: DataTypes.STRING, 
      allowNull: false    
    },
    period: {
      type: DataTypes.STRING,     
    },  
    active:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: { model: 'users', key: 'id' },
      allowNull: false
    },    
   
  }, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
