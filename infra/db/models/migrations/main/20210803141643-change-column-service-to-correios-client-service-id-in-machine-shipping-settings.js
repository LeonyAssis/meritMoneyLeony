'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.renameColumn('machine_shipping_settings', 'service', 'correios_client_service_id', {
      }, {
        transaction
      });

      await queryInterface.changeColumn('machine_shipping_settings', 'correios_client_service_id', {
        type: Sequelize.INTEGER,
        allowNull: true
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
      await queryInterface.renameColumn('machine_shipping_settings', 'correios_client_service_id', 'service', {
      }, {
        transaction
      });

      await queryInterface.changeColumn('machine_shipping_settings', 'service', {
        type: Sequelize.ENUM('SEDEX', 'SEDEXCOBRAR', 'PAC', 'PACCOBRAR', 'SEDEX10', 'SEDEX12', 'SEDEXHOJE'),
        allowNull: true
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
