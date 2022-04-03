'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'commercial_wallets',
        'name', {
          type: Sequelize.STRING,
        }, {
          transaction
        },
      ).then(() => {
        return queryInterface.addIndex('commercial_wallets', ['name']);
      });
      await queryInterface.addColumn(
        'commercial_wallets',
        'impact_factor', {
          type: Sequelize.FLOAT,
        }, {
          transaction
        },
      ).then(() => {
        return queryInterface.addIndex('commercial_wallets', ['impact_factor']);
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
      await queryInterface.removeColumn('commercial_wallets',
        'name', {
          transaction
        });
      await queryInterface.removeColumn('commercial_wallets',
        'impact_factor', {
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
