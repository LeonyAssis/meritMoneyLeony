'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('machine_models', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    model: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    quantity_coil: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    machine_chip_type_id: {
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
