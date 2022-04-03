'use strict';

module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define('control_claims', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    control_claim_types_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description_error_scenario: {
      type: DataTypes.TEXT({
        length: 'long'
      }),
      allowNull: false
    },
    description_impact: {
      type: DataTypes.TEXT({
        length: 'long'
      }),
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    last_warning: {
      type: DataTypes.DATE,
      allowNull: false
    },
    finalized_at: DataTypes.DATE,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    freezeTableName: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
