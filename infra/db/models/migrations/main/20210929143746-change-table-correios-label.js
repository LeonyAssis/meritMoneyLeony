'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('correios_labels', 'correios_plp_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: 'correios_client_id'
      }, {
        transaction
      });

      await queryInterface.renameColumn('correios_labels', 'correios_client_id', 'correios_client_service_id', {
        transaction
      });

      await queryInterface.removeColumn('correios_labels', 'status', {
        transaction
      });
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
      await queryInterface.removeColumn('correios_labels', 'correios_plp_id', {
        transaction
      });

      await queryInterface.addColumn('correios_labels', 'status', {
        type: Sequelize.ENUM('available', 'used'),
        defaultValue: 'available',
        allowNull: false,
        after: 'check_digit'
      }, {
        transaction
      });
    } catch(err) {
      if (transaction) {
        await transaction.rollback();
      }
      return Promise.reject(err);
    }
  }
};
