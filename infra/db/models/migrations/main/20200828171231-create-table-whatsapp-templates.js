'use strict';
module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('whatsapp_templates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT.UNSIGNED
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      element_name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      namespace: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      argument_size: {
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
    });
  },
  down: (migration) => {
    return migration.dropTable('whatsapp_templates');
  }
};
