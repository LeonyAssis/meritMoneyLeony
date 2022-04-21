'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('balance_history', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      user_origin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      user_destiny: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        allowNull: true
      },
      value: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM,
        values: [
          'TRANSFER',
          'MONTHLY_INCOME',
          'BUY'
        ],
        allowNull: false
      },
      benefits_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      responsible_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        allowNull: false
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    }).then(() => queryInterface.addIndex('balance_history', ['user_origin', 'user_destiny', 'benefits_id', 'responsible_id', 'type']));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('balance_history');
  }
};