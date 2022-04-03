'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('machine_order_address', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    street: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    number: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    reference: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    neighborhood: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    zipcode: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(45),
      allowNull: false,
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
