'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('benefits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      brand: {
        type: Sequelize.STRING
      },
      company: {
        type: Sequelize.STRING
      },
      text: {
        type: Sequelize.TEXT('long')
      },
      value: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      period: {
        type: Sequelize.DATEONLY
      },   
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        unique: false,
      },
      active:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(() => queryInterface.addIndex('benefits', ['company','user_id']));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('benefits');
  }
};