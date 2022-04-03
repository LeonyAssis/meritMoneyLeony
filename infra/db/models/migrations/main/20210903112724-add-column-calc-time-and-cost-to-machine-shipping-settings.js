'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('machine_shipping_settings', 'calc_time_and_cost', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        after: 'delivery_advicemment'
      }, {
        transaction
      });

      await queryInterface.changeColumn('machine_shipping_settings', 'self_hand', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      }, {
        transaction
      });

      await queryInterface.changeColumn('machine_shipping_settings', 'delivery_advicemment', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
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
      await queryInterface.removeColumn('machine_shipping_settings', 'calc_time_and_cost', {
        transaction
      });

      await queryInterface.changeColumn('machine_shipping_settings', 'self_hand', {
        type: Sequelize.ENUM('s','n'),
        allowNull: true,
      }, {
        transaction
      });

      await queryInterface.changeColumn('machine_shipping_settings', 'delivery_advicemment', {
        type: Sequelize.ENUM('s','n'),
        allowNull: true,
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
  }
};
