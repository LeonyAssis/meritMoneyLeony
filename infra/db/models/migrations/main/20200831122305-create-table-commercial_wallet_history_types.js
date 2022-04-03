'use strict';
module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('commercial_wallet_history_types', {
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
      type_old: {
        type: DataTypes.STRING,
        allowNull: true
      },
      type_new: {
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
      return migration.addIndex('commercial_wallet_history_types', ['commercial_wallets_id']);
    }).then(() => {
      return migration.addIndex('commercial_wallet_history_types', ['type_old']);
    }).then(() => {
      return migration.addIndex('commercial_wallet_history_types', ['type_new']);
    }).then(() => {
      return migration.addIndex('commercial_wallet_history_types', ['user_id']);
    });
  },
  down: function (migration) {
    return migration
      .dropTable('commercial_wallet_history_types');
  }
};
