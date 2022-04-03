'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('document_situations', {
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
    status: {
      type: DataTypes.ENUM,
      values: ['waiting', 'new_account_block', 'emissions_block', 'document_block', 'error'],
      allowNull: false
    },
    output: {
      type: DataTypes.JSON,
      allowNull: true
    },
    updated_situation_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    received_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    blocked_emission_at: {
      allowNull: true,
      type: DataTypes.DATE
    },
    blocked_document_at: {
      allowNull: true,
      type: DataTypes.DATE
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
    updatedAt: 'updated_at'
  });

};
