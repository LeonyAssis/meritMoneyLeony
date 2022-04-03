'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('account_relationships', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    account: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    responsible: {
      type: DataTypes.STRING,
      allowNull: true
    },
    relationship_begining: {
      type: DataTypes.DATE,
      allowNull: false
    },
    partner_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    last_transaction: {
      type: DataTypes.DATE,
      allowNull: false
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
