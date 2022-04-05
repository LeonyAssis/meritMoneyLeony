'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('users', {
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
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    document: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role_id: {
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
