'use strict';

module.exports = {

  up: function (migration, DataTypes) {
    return migration.createTable('rate_negotiation_bankings', {
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
      requested_rate: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      rate_negotiation_config_status_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      rate_negotiation_types_id: {
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
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        type: DataTypes.DATE
      }
    }).then(() => {
      return migration.addIndex('rate_negotiation_bankings', ['rate_negotiations_id']);
    }).then(() => {
      return migration.addIndex('rate_negotiation_bankings', ['rate_negotiation_config_status_id']);
    }).then(() => {
      return migration.addIndex('rate_negotiation_bankings', ['rate_negotiation_types_id']);
    });
  },

  down: function (migration) {
    return migration
      .dropTable('rate_negotiation_bankings');
  }
};
