'use strict';
module.exports = {
  up: (migration, DataTypes) => {
    return migration.createTable('rate_negotiation_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      rate_negotiations_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      executer_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER
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
      return migration.addIndex('rate_negotiation_logs', ['rate_negotiations_id']);
    }).then(() => {
      return migration.addIndex('rate_negotiation_logs', ['executer_id']);
    }).then(() => {
      return migration.addIndex('rate_negotiation_logs', ['user_id']);
    });
  },
  down: (migration) => {
    return migration.dropTable('rate_negotiation_logs');
  }
};
