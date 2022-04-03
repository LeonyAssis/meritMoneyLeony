'use strict';
module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('commercial_wallet_history_analyses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      commercial_wallets_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status_analyses_old: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status_analyses_new: {
        type: DataTypes.STRING,
        allowNull: true
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true
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
      return migration.addIndex('commercial_wallet_history_analyses', ['commercial_wallets_id']);
    }).then(() => {
      return migration.addIndex('commercial_wallet_history_analyses', ['status_analyses_old']);
    }).then(() => {
      return migration.addIndex('commercial_wallet_history_analyses', ['status_analyses_new']);
    }).then(() => {
      return migration.addIndex('commercial_wallet_history_analyses', ['user_id']);
    });
  },
  down: function (migration) {
    return migration
      .dropTable('commercial_wallet_history_analyses');
  }
};
