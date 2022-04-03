'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('machine_model_checklists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      machine_model_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
      return migration.addIndex('machine_model_checklists', ['machine_model_id']);
    });
  },

  down: (migration) => {
    return migration.dropTable('machine_model_checklists');
  }
};
