'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('commercial_wallet_history_sizes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    commercial_wallets_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    size_old: {
      type: DataTypes.STRING,
      allowNull: true
    },
    size_new: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_special: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    freezeTableName: true
  });
};
