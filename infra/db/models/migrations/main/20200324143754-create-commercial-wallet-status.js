'use strict';
module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('commercial_wallet_status', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      commercial_wallet_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      commercial_wallet_status_type_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER
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
      return migration.addIndex('commercial_wallet_status', ['commercial_wallet_id']);
    }).then(() => {
      return migration.addIndex('commercial_wallet_status', ['commercial_wallet_status_type_id']);
    }).then(() => {
      return migration.addIndex('commercial_wallet_status', ['user_id']);
    });
  },
  down: (migration) => {
    return migration.dropTable('commercial_wallet_status');
  }
};
