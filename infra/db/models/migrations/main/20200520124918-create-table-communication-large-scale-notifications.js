'use strict';

module.exports = {

  up: function (migration, DataTypes) {
    return migration.createTable('communication_large_scale_notifications', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      communication_large_scale_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      from_identificator: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ticket_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      communication_large_scale_notification_status_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      balancing: {
        type: DataTypes.TINYINT,
        allowNull: false,
      },
      attempts: {
        type: DataTypes.TINYINT,
        allowNull: false
      },
      processed_at: {
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
    });
  },

  down: function (migration) {
    return migration
      .dropTable('communication_large_scale_notifications');
  }
};
