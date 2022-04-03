'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('machine_alert_tickets', {
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
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ticket_id: {
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
      return migration.addIndex('machine_alert_tickets', ['alert_id']);
    }).then(() => {
      return migration.addIndex('machine_alert_tickets', ['account_id']);
    }).then(() => {
      return migration.addIndex('machine_alert_tickets', ['ticket_id']);
    });
  },
  down: (migration) => {
    return migration.dropTable('machine_alert_tickets');
  }
};
