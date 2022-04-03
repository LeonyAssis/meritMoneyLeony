'use strict';

module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define('control_claim_fixed_professionals', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_professional_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name_professional: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    sector: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
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
