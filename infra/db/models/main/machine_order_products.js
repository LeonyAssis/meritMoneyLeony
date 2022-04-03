'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('machine_order_products', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    acquisition_type: {
      type: DataTypes.ENUM('buy', 'rent', 'trial'),
      allowNull: false
    },
    machine_order_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    machine_model_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    machine_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });
};
