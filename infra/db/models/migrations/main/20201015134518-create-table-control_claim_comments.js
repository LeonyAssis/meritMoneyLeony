'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('control_claim_comments', {
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
      comment: {
        type: DataTypes.TEXT({
          length: 'long'
        }),
        allowNull: false
      },
      important: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 0
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
      return migration.addIndex('control_claim_comments', ['control_claims_id']);
    }).then(() => {
      return migration.addIndex('control_claim_comments', ['user_id']);
    });
  },
  down: (migration) => {
    return migration.dropTable('control_claim_comments');
  }
};
