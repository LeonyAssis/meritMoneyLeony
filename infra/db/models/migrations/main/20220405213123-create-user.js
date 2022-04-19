'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(180),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(180),
        allowNull: false,
      },
      document: {
        type: Sequelize.STRING(11),
        unique: true,
      },
      password:{
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      active:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      role_id: {
        type: Sequelize.INTEGER,
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
    }).then(() => queryInterface.addIndex('users', ['email', 'document']));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};