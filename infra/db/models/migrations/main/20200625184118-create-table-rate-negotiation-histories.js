'use strict';

module.exports = {

  up: function (migration, DataTypes) {
    return migration.createTable('rate_negotiation_histories', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      rate_negotiation_billets_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      rate_negotiation_cards_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      rate_negotiation_bankings_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      rate_negotiation_config_status_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      data_alter: {
        type: DataTypes.JSON,
        allowNull: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
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
      return migration.addIndex('rate_negotiation_histories', ['rate_negotiation_billets_id']);
    }).then(() => {
      return migration.addIndex('rate_negotiation_histories', ['rate_negotiation_cards_id']);
    }).then(() => {
      return migration.addIndex('rate_negotiation_histories', ['rate_negotiation_bankings_id']);
    }).then(() => {
      return migration.addIndex('rate_negotiation_histories', ['rate_negotiation_config_status_id']);
    });
  },

  down: function (migration) {
    return migration
      .dropTable('rate_negotiation_histories');
  }
};
