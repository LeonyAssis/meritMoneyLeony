'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'commercial_wallets',
        'commercial_size', {
        type: Sequelize.STRING(25),
        defaultValue: null,
        after: 'status_analyses',
        allowNull: true
      }, {
        transaction
      },
      ).then(() => {
        return queryInterface.addIndex('commercial_wallets', ['commercial_size']);
      });
      await queryInterface.addColumn(
        'commercial_wallets',
        'is_special', {
        type: Sequelize.INTEGER(1),
        defaultValue: '0',
        after: 'commercial_size',
        allowNull: true
      }, {
        transaction
      },
      );
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
        'commercial_size', {
        transaction
      });
      await queryInterface.removeColumn('commercial_wallets',
        'is_special', {
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
