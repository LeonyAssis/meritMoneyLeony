'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('commercial_wallet_history_analyses', {
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
    status_analyses_old: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status_analyses_new: {
      type: DataTypes.STRING,
      allowNull: true
    },
    reason: {
      type: DataTypes.TEXT,
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
