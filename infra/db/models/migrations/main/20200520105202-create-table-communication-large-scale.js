'use strict';

module.exports = {

  up: function (migration, DataTypes) {
    return migration.createTable('communication_large_scale', {
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
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        type: DataTypes.DATE
      }
    }).then(() => {
      return migration.addIndex('communication_large_scale', ['user_id']);
    });
  },

  down: function (migration) {
    return migration
      .dropTable('communication_large_scale');
  }
};
