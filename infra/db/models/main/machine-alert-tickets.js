'use strict';

module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define('machine_alert_tickets', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    alert_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ticket_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
