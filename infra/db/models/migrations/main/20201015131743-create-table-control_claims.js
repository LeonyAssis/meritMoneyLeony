'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('control_claims', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      control_claim_types_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      description_error_scenario: {
        type: DataTypes.TEXT({
          length: 'long'
        }),
        allowNull: false
      },
      description_impact: {
        type: DataTypes.TEXT({
          length: 'long'
        }),
        allowNull: false
      },
      finalized_at: {
        type: DataTypes.DATE
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
      return migration.addIndex('control_claims', ['control_claim_types_id']);
    });
  },
  down: (migration) => {
    return migration
      .dropTable('control_claims');
  }
};
