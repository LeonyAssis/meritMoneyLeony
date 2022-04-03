'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.changeColumn('machine_orders', 'status', {
        type: Sequelize.ENUM('open', 'awaiting_invoice', 'awaiting_shipping', 'done', 'canceled'),
        allowNull: false,
      }, {
        transaction
      });

      await queryInterface.addColumn('machine_orders', 'canceled_by', {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: 'concluded_by'
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
      await queryInterface.changeColumn('machine_orders', 'status', {
        type: Sequelize.ENUM('open', 'awaiting_invoice', 'awaiting_shipping', 'done'),
        allowNull: false,
      }, {
        transaction
      });


      await queryInterface.removeColumn('machine_orders', 'canceled_by', {
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
