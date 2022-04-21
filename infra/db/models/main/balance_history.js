'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('balance_history', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    user_origin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    user_destiny: {
      type: DataTypes.INTEGER,
      references: { model: 'users', key: 'id' },
      allowNull: true
    },
    value: {
      type: DataTypes.INTEGER,
      references: { model: 'users', key: 'id' },
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM,
      values: [
        'TRANSFER',
        'MONTHLY_INCOME',
        'BUY'
      ],
      allowNull: false
    },
    benefits_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    responsible_id: {
      type: DataTypes.INTEGER,
      references: { model: 'users', key: 'id' },
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