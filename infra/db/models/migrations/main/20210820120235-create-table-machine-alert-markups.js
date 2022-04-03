'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('machine_alert_markups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      alert_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      unmarked_by: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
      return migration.addIndex('machine_alert_markups', ['alert_id']);
    }).then(() => {
      return migration.addIndex('machine_alert_markups', ['user_id']);
    });
  },
  down: (migration) => {
    return migration.dropTable('machine_alert_markups');
  }
};
