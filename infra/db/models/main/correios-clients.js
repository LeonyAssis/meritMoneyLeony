'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('correios_clients', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    post_card: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    contract: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    administrative_code: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    cnpj: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });
};
