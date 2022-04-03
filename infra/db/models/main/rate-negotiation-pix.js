'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('rate_negotiation_pix', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    rate_negotiations_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rate: {
      type: DataTypes.JSON,
      allowNull: true
    },
    rate_negotiation_config_status_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    approver_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    approvation_reason: {
      type: DataTypes.TEXT,
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
