'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('document_situation_participants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      document_situations_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ispb: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      code: {
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
      return migration.addIndex('document_situation_participants', ['document_situations_id']);
    }).then(() => {
      return migration.addIndex('document_situation_participants', ['ispb']);
    }).then(() => {
      return migration.addIndex('document_situation_participants', ['code']);
    });
  },
  down: function (migration) {
    return migration
      .dropTable('document_situation_participants');
  }
};
