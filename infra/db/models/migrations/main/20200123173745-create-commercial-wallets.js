'use strict';
module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('commercial_wallets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      profile_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      document_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      document: {
        allowNull: false,
        type: DataTypes.STRING
      },
      type: {
        allowNull: false,
        type: DataTypes.STRING
      },
      reference_value: {
        allowNull: true,
        type: DataTypes.STRING
      },
      responsible_analyst: {
        allowNull: true,
        type: DataTypes.STRING
      },
      start_date: {
        type: DataTypes.DATE
      },
      end_date: {
        type: DataTypes.DATE
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    }).then(() => {
      return migration.addIndex('commercial_wallets', ['profile_id']);
    }).then(() => {
      return migration.addIndex('commercial_wallets', ['document_id']);
    }).then(() => {
      return migration.addIndex('commercial_wallets', ['document']);
    }).then(() => {
      return migration.addIndex('commercial_wallets', ['type']);
    }).then(() => {
      return migration.addIndex('commercial_wallets', ['responsible_analyst']);
    }).then(() => {
      return migration.addIndex('commercial_wallets', ['start_date']);
    }).then(() => {
      return migration.addIndex('commercial_wallets', ['end_date']);
    });
  },
  down: (migration) => {
    return migration.dropTable('commercial_wallet');
  }
};
