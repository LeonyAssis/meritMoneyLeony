'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('document_situations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      message_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      document: {
        type: DataTypes.STRING,
        allowNull: false
      },
      situation: {
        type: DataTypes.STRING,
        allowNull: false
      },
      updated_situation_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      received_at: {
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
      return migration.addIndex('document_situations', ['message_id']);
    }).then(() => {
      return migration.addIndex('document_situations', ['type']);
    }).then(() => {
      return migration.addIndex('document_situations', ['document']);
    }).then(() => {
      return migration.addIndex('document_situations', ['situation']);
    }).then(() => {
      return migration.addIndex('document_situations', ['received_at']);
    });
  },
  down: function (migration) {
    return migration
      .dropTable('document_situations');
  }
};
