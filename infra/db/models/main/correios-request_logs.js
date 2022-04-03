'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('correios_request_logs', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    gis_log_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    func_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    success: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    req: {
      type: DataTypes.JSON,
      allowNull: true
    },
    res: {
      type: DataTypes.JSON,
      allowNull: true
    },
    err: {
      type: DataTypes.JSON,
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
