'use strict';
module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('whatsapp_messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT.UNSIGNED
      },
      whatsapp_phones_id: {
        allowNull: false,
        type: DataTypes.BIGINT.UNSIGNED
      },
      message_variables: {
        allowNull: false,
        type: DataTypes.JSON
      },
      type_link: {
        allowNull: true,
        type: DataTypes.ENUM('video', 'image', 'audio', 'document'),
      },
      link: {
        allowNull: true,
        type: DataTypes.STRING
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      status: {
        allowNull: false,
        type: DataTypes.ENUM('waiting', 'sent', 'error'),
      },
      output: {
        allowNull: true,
        type: DataTypes.JSON
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
      return migration.addIndex('whatsapp_messages', ['whatsapp_phones_id']);
    }).then(() => {
      return migration.addIndex('whatsapp_messages', ['user_id']);
    }).then(() => {
      return migration.addIndex('whatsapp_messages', ['status']);
    });
  },
  down: (migration) => {
    return migration.dropTable('whatsapp_messages');
  }
};
