'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('correios_client_services', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      correios_client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      correios_service_id: {
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
    });

  },
  down: (migration) => {
    return migration.dropTable('correios_client_services');
  }
};
