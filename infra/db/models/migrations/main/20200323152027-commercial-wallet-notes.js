'use strict';

module.exports = {
  up: function (migration, DataTypes) {
    return migration.createTable('commercial_wallet_notes', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      commercial_wallet_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      note_types_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      important: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      content: {
        type: DataTypes.TEXT,
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
      return migration.addIndex('commercial_wallet_notes', ['commercial_wallet_id']);
    }).then(() => {
      return migration.addIndex('commercial_wallet_notes', ['note_types_id']);
    }).then(() => {
      return migration.addIndex('commercial_wallet_notes', ['user_id']);
    });
  },

  down: function (migration) {
    return migration
      .dropTable('commercial_wallet_notes');
  }
};
