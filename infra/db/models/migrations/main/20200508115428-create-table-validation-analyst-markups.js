'use strict';

module.exports = {
  up: function (migration, DataTypes) {
    return migration.createTable('document_validation_analyst_markups', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      open_accounts_validation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
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
    }).then(() => migration.addIndex('document_validation_analyst_markups', ['open_accounts_validation_id']));
  },

  down: function (migration) {
    return migration
      .dropTable('document_validation_analyst_markups');
  }
};
