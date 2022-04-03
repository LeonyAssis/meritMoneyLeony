'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('commercial_wallet_history_types', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    commercial_wallets_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type_old: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type_new: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    freezeTableName: true
  });
};
