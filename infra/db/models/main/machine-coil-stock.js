'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('machine_coil_stock', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    available_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity_received: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity_sent: {
      type: DataTypes.INTEGER,
      allowNull: false
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
