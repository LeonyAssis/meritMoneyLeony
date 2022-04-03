'use strict';
module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('whatsapp_phones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT.UNSIGNED
      },
      phone: {
        allowNull: false,
        type: DataTypes.STRING
      },
      alternative_account: {
        allowNull: true,
        type: DataTypes.STRING
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
      return migration.addIndex('whatsapp_phones', ['phone']);
    }).then(() => {
      return migration.addIndex('whatsapp_phones', ['alternative_account']);
    });
  },
  down: (migration) => {
    return migration.dropTable('whatsapp_phones');
  }
};
