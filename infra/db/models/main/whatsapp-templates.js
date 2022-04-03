'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('whatsapp_templates', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    element_name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    namespace: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    argument_size: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
