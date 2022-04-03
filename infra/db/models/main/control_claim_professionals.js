'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('control_claim_professionals', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      control_claims_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      control_claim_professional_types_id: {
        type: DataTypes.INTEGER,
        allowNull: false
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
      status: {
        type: DataTypes.INTEGER(1),
        defaultValue: 1,
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },   
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  },
    {
      freezeTableName: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
};
