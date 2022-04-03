'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('account_relationships', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      account: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      responsible: {
        type: DataTypes.STRING,
        allowNull: false
      },
      relationship_begining: {
        type: DataTypes.DATE,
        allowNull: false
      },
      partner_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      last_transaction: {
        type: DataTypes.DATE,
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
      return migration.addIndex('account_relationships', ['account']);
    }).then(() => {
      return migration.addIndex('account_relationships', ['partner_id']);
    }).then(() => {
      return migration.addIndex('account_relationships', ['responsible']);
    });

  },
  down: (migration) => {
    return migration.dropTable('account_relationships');
  }
};
