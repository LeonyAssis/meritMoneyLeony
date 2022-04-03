'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('correios_labels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      label: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      check_digit: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('available', 'used'),
        defaultValue: 'available',
        allowNull: false
      },
      correios_client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    return migration.dropTable('correios_labels');
  }
};
