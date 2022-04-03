'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('commercial_wallet_history_sizes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(11)
      },
      type: {
        type: DataTypes.ENUM('mark_special', 'alter_size', 'mark_special_and_alter_size'),
        allowNull: true
      },
      commercial_wallets_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      size_old: {
        type: DataTypes.STRING(25),
        allowNull: true
      },
      size_new: {
        type: DataTypes.STRING(25),
        allowNull: true
      },
      is_special: {
        type: DataTypes.INTEGER(1),
        allowNull: true
      },
      user_id: {
        type: DataTypes.INTEGER(11),
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
      return migration.addIndex('commercial_wallet_history_sizes', ['type']);
    }).then(() => {
      return migration.addIndex('commercial_wallet_history_sizes', ['commercial_wallets_id']);
    }).then(() => {
      return migration.addIndex('commercial_wallet_history_sizes', ['size_old']);
    }).then(() => {
      return migration.addIndex('commercial_wallet_history_sizes', ['size_new']);
    }).then(() => {
      return migration.addIndex('commercial_wallet_history_sizes', ['user_id']);
    });
  },
  down: (migration) => {
    return migration.dropTable('commercial_wallet_history_sizes');
  }
};
