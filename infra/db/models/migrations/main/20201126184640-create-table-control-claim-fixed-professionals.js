'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('control_claim_fixed_professionals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      user_professional_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      name_professional: {
        type: DataTypes.STRING(45),
        allowNull: false
      },
      sector: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      active: {
        type: DataTypes.BOOLEAN,
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
    return migration.dropTable('control_claim_professional_types');
  }
};
