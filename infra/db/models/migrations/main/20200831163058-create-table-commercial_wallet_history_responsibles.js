'use strict';
module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('commercial_wallet_history_responsibles', {
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
      responsible_analyst_old: {
        type: DataTypes.STRING,
        allowNull: true
      },
      responsible_analyst_new: {
        type: DataTypes.STRING,
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
      return migration.addIndex('commercial_wallet_history_responsibles', ['commercial_wallets_id']);
    }).then(() => {
      return migration.addIndex('commercial_wallet_history_responsibles', ['responsible_analyst_old']);
    }).then(() => {
      return migration.addIndex('commercial_wallet_history_responsibles', ['responsible_analyst_new']);
    }).then(() => {
      return migration.addIndex('commercial_wallet_history_responsibles', ['user_id']);
    });
  },
  down: function (migration) {
    return migration
      .dropTable('commercial_wallet_history_responsibles');
  }
};
