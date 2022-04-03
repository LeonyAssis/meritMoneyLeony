'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('machine_alert_notes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      account_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
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
      return migration.addIndex('machine_alert_notes', ['user_id']);
    }).then(() => {
      return migration.addIndex('machine_alert_notes', ['account_id']);
    });
  },
  down: (migration) => {
    return migration.dropTable('machine_alert_notes');
  }
};
