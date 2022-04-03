'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.changeColumn('machines', 'business_type', {
        type: Sequelize.ENUM('buy', 'rent', 'trial'),
        allowNull: false,
      }, {
        transaction
      });

      await transaction.commit();
      return Promise.resolve();
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      return Promise.reject(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.changeColumn('machines', 'business_type', {
        type: Sequelize.ENUM('buy', 'rent'),
        allowNull: false,
      }, {
        transaction
      });
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      return Promise.reject(err);
    }
  }
};
