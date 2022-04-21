'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('automatic_balance_config', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      value: {
        type: Sequelize.INTEGER
      },
      day_to_send_balance: {
        type: Sequelize.INTEGER
      },
      last_user_set: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
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
  down: (queryInterface) => {
    return queryInterface.dropTable('automatic_balance_configs');
  }
};