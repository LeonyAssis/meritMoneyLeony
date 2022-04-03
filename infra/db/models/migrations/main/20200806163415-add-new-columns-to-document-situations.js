'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'document_situations',
        'status', {
          type: Sequelize.ENUM,
          values: ['waiting', 'new_account_block', 'emissions_block', 'document_block', 'error'],
          defaultValue: 'waiting',
          allowNull: false
        }, {
          transaction
        },
      ).then(() => {
        return queryInterface.addIndex('document_situations', ['status']);
      });
      await queryInterface.addColumn(
        'document_situations',
        'output', {
          type: Sequelize.JSON,
          allowNull: true
        }, {
          transaction
        },
      );
      await queryInterface.addColumn(
        'document_situations',
        'blocked_emission_at', {
          type: Sequelize.DATE,
          allowNull: true
        }, {
          transaction
        },
      );
      await queryInterface.addColumn(
        'document_situations',
        'blocked_document_at', {
          type: Sequelize.DATE,
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
      await queryInterface.removeColumn('document_situations',
        'status', {
          transaction
        });
      await queryInterface.removeColumn('document_situations',
        'output', {
          transaction
        });
      await queryInterface.removeColumn('document_situations',
        'blocked_emission_at', {
          transaction
        });
      await queryInterface.removeColumn('document_situations',
        'blocked_document_at', {
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
