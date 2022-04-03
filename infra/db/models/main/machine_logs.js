'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('machine_logs', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    machine_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null
    },
    current_client_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('in_stock', 'inactived', 'actived', 'blocked', 'unblocked', 'defected', 'repaired', 'discarded', 'warranty'),
      allowNull: false,
      defaultValue: 'defect'
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
