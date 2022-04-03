'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('machine_tracking', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      code: {
        type: DataTypes.STRING(45),
      },
      company: {
        type: DataTypes.STRING(45),
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
    return migration.dropTable('machine_tracking');
  }
};
