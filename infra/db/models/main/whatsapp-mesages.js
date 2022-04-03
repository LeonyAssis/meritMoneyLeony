'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('whatsapp_messages', {
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
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
