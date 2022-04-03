'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('correios_labels', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    label: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    check_digit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    correios_client_service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    correios_plp_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
