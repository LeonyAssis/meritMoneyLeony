'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('commercial_wallet_history_responsibles', {
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
    responsible_analyst_old: {
      type: DataTypes.STRING,
      allowNull: true
    },
    responsible_analyst_new: {
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
