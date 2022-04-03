'use strict';

module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define('machine_clients', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    profile_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    account: {
      type: DataTypes.VIRTUAL,
      get() {
        return this._account;
      },
      set(value) {
        this._account = value;
      }
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
