'use strict';

module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('credit_analysis_history', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false
      },
      name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('credit_granted', 'credit_denied', 'in_analysis'),
        default: 'in_analysis',
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        type: DataTypes.DATE
      }
    }).then(() => {
      return migration.addIndex('credit_analysis_history', ['request_id']);
    }).then(() => {
      return migration.addIndex('credit_analysis_history', ['user_id']);
    });
  },

  down: (migration) => {
    return migration.dropTable('credit_analysis_history');
  }
};
