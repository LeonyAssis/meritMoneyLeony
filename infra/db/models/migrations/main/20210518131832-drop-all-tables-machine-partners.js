'use strict';

module.exports = {
  up: async (queryInterface) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.dropTable('machine_partners');
      await queryInterface.dropTable('machine_trade_partners');

      await transaction.commit();
      return Promise.resolve();
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      return Promise.reject(err);
    }
  },

  // down: (queryInterface, Sequelize) => {
  //   /*
  //     Add reverting commands here.
  //     Return a promise to correctly handle asynchronicity.

  //     Example:
  //     return queryInterface.dropTable('users');
  //   */
  // }
};
