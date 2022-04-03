'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('machine_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      machine_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      current_client_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      status: {
        allowNull: false,
        type: DataTypes.ENUM('in_stock', 'inactived', 'actived', 'blocked', 'unblocked', 'defected', 'repaired', 'discarded', 'warranty'),
      },
      description: {
        type: DataTypes.STRING(255),
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
      return migration.addIndex('machine_logs', ['machine_id']);
    }).then(() => {
      return migration.addIndex('machine_logs', ['current_client_id']);
    });

  },
  down: (migration) => {
    return migration.dropTable('machine_logs');
  }
};
