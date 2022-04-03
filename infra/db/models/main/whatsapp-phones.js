'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('whatsapp_phones', {
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
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
