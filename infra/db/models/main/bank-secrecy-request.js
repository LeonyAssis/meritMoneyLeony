'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('bank_secrecy_requests', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    origin: {
      type: DataTypes.ENUM,
      values: ['bc_correios', 'ccs'],
      allowNull: false
    },
    statement_request_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    document: {
      type: DataTypes.STRING,
      allowNull: false
    },
    control_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    begin_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    judicial_process: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shipping_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    receipt_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    receipt_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

};
