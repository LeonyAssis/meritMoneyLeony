'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'bank_secrecy_requests',
        'statement_request_id', {
          type: Sequelize.STRING(25),
          after: 'origin'
        }, {
          transaction
        },
      ).then(() => {
        return queryInterface.addIndex('bank_secrecy_requests', ['statement_request_id']);
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

  down: async (queryInterface) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('bank_secrecy_requests',
        'statement_request_id', {
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
};
