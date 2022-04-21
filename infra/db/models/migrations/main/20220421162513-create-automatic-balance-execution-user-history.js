'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('automatic_balance_execution_user_history', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
      },
      automatic_balance_id: {
        type: Sequelize.INTEGER,
        references: { model: 'automatic_balance_execution_status', key: 'id' },
      },     
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('automatic_balance_execution_user_history');
  }
};