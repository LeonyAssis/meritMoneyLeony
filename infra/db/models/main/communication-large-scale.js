'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('communication_large_scale', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    communication_large_scale_options_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    from: {
      type: DataTypes.TEXT({
        length: 'long'
      }),
      allowNull: false
    },
    total_amount_to_process: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_amount_processed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    communication_large_scale_status_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    scheduled_at: {
      allowNull: true,
      type: DataTypes.DATE
    },
    started_at: {
      allowNull: true,
      type: DataTypes.DATE
    },
    finished_at: {
      allowNull: true,
      type: DataTypes.DATE
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
