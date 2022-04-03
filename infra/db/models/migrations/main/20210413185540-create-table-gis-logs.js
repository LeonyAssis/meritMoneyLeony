'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('gis_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      route: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      method: {
        type: DataTypes.STRING(10),
        allowNull: false
      },
      req: {
        type: DataTypes.JSON,
        allowNull: false
      },
      app_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      version: {
        type: DataTypes.STRING(20),
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
      return migration.addIndex('gis_logs', ['route']);
    }).then(() => {
      return migration.addIndex('gis_logs', ['app_id']);
    }).then(() => {
      return migration.addIndex('gis_logs', ['created_at']);
    });
  },

  down: (migration) => {
    return migration.dropTable('gis_logs');
  }
};
