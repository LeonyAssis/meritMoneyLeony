'use strict';

module.exports = {
  up: function (migration, DataTypes) {
    return migration.createTable('commercial_wallet_performance_tracking', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      commercial_wallet_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      total_amount: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      receipt_number: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      reference_date: {
        type: DataTypes.DATE,
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
      return migration.addIndex('commercial_wallet_performance_tracking', ['commercial_wallet_id']);
    }).then(() => {
      return migration.addIndex('commercial_wallet_performance_tracking', ['reference_date']);
    });
  },

  down: function (migration) {
    return migration
      .dropTable('commercial_wallet_performance_tracking');
  }
};
