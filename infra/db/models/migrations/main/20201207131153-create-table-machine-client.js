'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('machine_clients', {
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
      profile_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('linked', 'actived', 'blocked'),
        allowNull: false,
        defaultValue: 'linked'
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      activated_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      blocked_at: {
        type: DataTypes.DATE,
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
    });
  },
  down: (migration) => {
    return migration.dropTable('machine_clients');
  }
};
