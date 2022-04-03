'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'commercial_analysts',
        'special_accounts', {
        type: Sequelize.ENUM,
        values: ['0', '1'],
        defaultValue: '0',
        allowNull: false,
        after: 'email'
      }, {
        transaction
      },
      );
      await queryInterface.addColumn(
        'commercial_analysts',
        'small', {
        type: Sequelize.ENUM,
        values: ['0', '1'],
        defaultValue: '0',
        allowNull: false,
        after: 'email'
      }, {
        transaction
      },
      );
      await queryInterface.addColumn(
        'commercial_analysts',
        'normal', {
        type: Sequelize.ENUM,
        values: ['0', '1'],
        defaultValue: '0',
        allowNull: false,
        after: 'small'
      }, {
        transaction
      },
      );
      await queryInterface.addColumn(
        'commercial_analysts',
        'larger', {
        type: Sequelize.ENUM,
        values: ['0', '1'],
        defaultValue: '0',
        allowNull: false,
        after: 'normal'
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
      await queryInterface.removeColumn('commercial_analysts',
        'special_accounts', {
        transaction
      });
      await queryInterface.removeColumn('commercial_analysts',
        'small', {
        transaction
      });
      await queryInterface.removeColumn('commercial_analysts',
        'normal', {
        transaction
      });
      await queryInterface.removeColumn('commercial_analysts',
        'larger', {
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
