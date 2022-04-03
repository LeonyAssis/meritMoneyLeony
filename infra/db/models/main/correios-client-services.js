'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('correios_client_services', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    correios_client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    correios_service_id: {
      type: DataTypes.INTEGER,
      allowNull: true
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
