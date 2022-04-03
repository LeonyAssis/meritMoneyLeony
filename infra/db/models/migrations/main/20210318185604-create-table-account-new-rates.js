'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('account_new_rates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      account: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
      },
      old_rate: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      new_rate: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      executed_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      input: {
        type: DataTypes.JSON,
        allowNull: true
      },
      output: {
        type: DataTypes.JSON,
        allowNull: true
      },
      code: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      balancing: {
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
      return migration.addIndex('account_new_rates', ['account']);
    }).then(() => {
      return migration.addIndex('account_new_rates', ['code']);
    }).then(() => {
      return migration.addIndex('account_new_rates', ['balancing']);
    }).then(() => {
      return migration.addIndex('account_new_rates', ['priority']);
    });
  },

  down: (migration) => {
    return migration.dropTable('account_new_rates');
  }
};
