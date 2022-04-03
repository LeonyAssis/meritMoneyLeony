'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('correios_plp', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      plp_number: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      correios_client_service_id: {
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
    });

  },
  down: (migration) => {
    return migration.dropTable('correios_plp');
  }
};
