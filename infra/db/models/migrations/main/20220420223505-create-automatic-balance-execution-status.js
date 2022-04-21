'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('automatic_balance_execution_status', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      choose_date: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.NOW
      },
      value: {
        type: Sequelize.INTEGER
      },     
      status: {
        type: Sequelize.ENUM,
        values: [
          'EXECUTING',
          'PENDING',
          'FINISHED',  
          'ERROR'
        ],
      },
      error_users: {
        type: Sequelize.JSON,
        allowNull: true,
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
    return queryInterface.dropTable('automatic_balance_execution_status');
  }
};