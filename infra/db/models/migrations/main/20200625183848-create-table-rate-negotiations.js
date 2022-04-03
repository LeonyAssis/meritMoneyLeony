'use strict';

module.exports = {

  up: function (migration, DataTypes) {
    return migration.createTable('rate_negotiations', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      profile_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      document: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      input_channel: {
        type: DataTypes.STRING,
        allowNull: false
      },
      input_channel_reference: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rate_negotiation_status_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      rate_negotiation_reasons_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      responsible_user_id: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      assigned_responsible_at: {
        allowNull: true,
        type: DataTypes.DATE
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      observation: {
        type: DataTypes.TEXT,
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
      return migration.addIndex('rate_negotiations', ['responsible_user_id']);
    }).then(() => {
      return migration.addIndex('rate_negotiations', ['profile_id']);
    }).then(() => {
      return migration.addIndex('rate_negotiations', ['account_id']);
    }).then(() => {
      return migration.addIndex('rate_negotiations', ['document']);
    }).then(() => {
      return migration.addIndex('rate_negotiations', ['rate_negotiation_status_id']);
    });
  },

  down: function (migration) {
    return migration
      .dropTable('rate_negotiations');
  }
};
