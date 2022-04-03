'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('control_claim_tickets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      control_claims_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ticket_id: {
        type: DataTypes.INTEGER,
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
      return migration.addIndex('control_claim_tickets', ['control_claims_id']);
    }).then(() => {
      return migration.addIndex('control_claim_tickets', ['ticket_id']);
    }).then(() => {
      return migration.addIndex('control_claim_tickets', ['user_id']);
    });
  },
  down: (migration) => {
    return migration.dropTable('control_claim_tickets');
  }
};
