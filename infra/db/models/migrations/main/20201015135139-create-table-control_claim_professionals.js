'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('control_claim_professionals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      control_claims_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      control_claim_professional_types_id: {
        type: DataTypes.INTEGER,
        allowNull: false
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
      status: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 1
      },
      user_id: {
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
    }).then(() => {
      return migration.addIndex('control_claim_professionals', ['control_claims_id']);
    }).then(() => {
      return migration.addIndex('control_claim_professionals', ['control_claim_professional_types_id']);
    }).then(() => {
      return migration.addIndex('control_claim_professionals', ['user_professional_id']);
    });
  },
  down: (migration) => {
    return migration.dropTable('control_claim_professionals');
  }
};
