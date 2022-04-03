'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'rate_negotiation_histories',
        'rate_negotiation_pix_id', {
        type: Sequelize.INTEGER,
        after: 'rate_negotiation_bankings_id'
      }, {
        transaction
      },
      ).then(() => {
        return queryInterface.addIndex('rate_negotiation_histories', ['rate_negotiation_pix_id']);
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
      await queryInterface.removeColumn('rate_negotiation_histories',
        'rate_negotiation_bankings_id', {
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
