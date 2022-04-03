'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('correios_clients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      post_card: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      contract: {
        type: DataTypes.STRING(45),
        allowNull: false
      },
      administrative_code: {
        type: DataTypes.STRING(45),
        allowNull: false
      },
      cnpj: {
        type: DataTypes.STRING(45),
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
    return migration.dropTable('correios_clients');
  }
};
