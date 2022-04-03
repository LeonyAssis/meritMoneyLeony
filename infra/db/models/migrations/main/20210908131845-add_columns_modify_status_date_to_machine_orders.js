'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('machine_orders', 'linked_by', {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: 'user_id'
      }, {
        transaction
      });

      await queryInterface.addColumn('machine_orders', 'invoice_uploaded_by', {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: 'linked_by'
      }, {
        transaction
      });

      await queryInterface.addColumn('machine_orders', 'concluded_by', {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: 'invoice_uploaded_by'
      }, {
        transaction
      });

      await queryInterface.addColumn('machine_orders', 'linked_at', {
        type: Sequelize.DATE,
        allowNull: true,
        after: 'concluded_by'
      }, {
        transaction
      });

      await queryInterface.addColumn('machine_orders', 'invoice_uploaded_at', {
        type: Sequelize.DATE,
        allowNull: true,
        after: 'linked_at'
      }, {
        transaction
      });

      await queryInterface.addColumn('machine_orders', 'concluded_at', {
        type: Sequelize.DATE,
        allowNull: true,
        after: 'invoice_uploaded_at'
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

  down: async (queryInterface) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('machine_orders', 'linked_by', {
        transaction
      });

      await queryInterface.removeColumn('machine_orders', 'invoice_uploaded_by', {
        transaction
      });

      await queryInterface.removeColumn('machine_orders', 'concluded_by', {
        transaction
      });

      await queryInterface.removeColumn('machine_orders', 'linked_at', {
        transaction
      });

      await queryInterface.removeColumn('machine_orders', 'invoice_uploaded_at', {
        transaction
      });

      await queryInterface.removeColumn('machine_orders', 'concluded_at', {
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
  }
};
