'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'machine_order_shipping',
        'delivery_time', {
          type: Sequelize.INTEGER,
          allowNull: true,
          after: 'shipment_price'
        }, {
          transaction
        },
      );
      await queryInterface.addColumn(
        'machine_order_shipping',
        'posted_at', {
          type: Sequelize.DATE,
          allowNull: true,
          after: 'delivery_time'
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
      await queryInterface.removeColumn('machine_order_shipping',
        'delivery_time', {
          transaction
        });
      await queryInterface.removeColumn('machine_order_shipping',
        'posted_at', {
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
