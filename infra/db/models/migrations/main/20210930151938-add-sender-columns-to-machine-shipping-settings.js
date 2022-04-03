'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('machine_shipping_settings', 'correios_directorship_number', {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: 'correios_client_service_id'
      }, {
        transaction
      });

      await queryInterface.addColumn('machine_shipping_settings', 'sender_name', {
        type: Sequelize.STRING(100),
        allowNull: true,
        after: 'correios_directorship_number'
      }, {
        transaction
      });

      await queryInterface.addColumn('machine_shipping_settings', 'sender_street', {
        type: Sequelize.STRING(100),
        allowNull: true,
        after: 'sender_name'
      }, {
        transaction
      });

      await queryInterface.addColumn('machine_shipping_settings', 'sender_number', {
        type: Sequelize.STRING(45),
        allowNull: true,
        after: 'sender_street'
      }, {
        transaction
      });

      await queryInterface.addColumn('machine_shipping_settings', 'sender_neighborhood', {
        type: Sequelize.STRING(100),
        allowNull: true,
        after: 'sender_number'
      }, {
        transaction
      });

      await queryInterface.addColumn('machine_shipping_settings', 'sender_city', {
        type: Sequelize.STRING(100),
        allowNull: true,
        after: 'origin_zipcode'
      }, {
        transaction
      });

      await queryInterface.addColumn('machine_shipping_settings', 'sender_state', {
        type: Sequelize.STRING(2),
        allowNull: true,
        after: 'sender_city'
      }, {
        transaction
      });

      await queryInterface.addColumn('machine_shipping_settings', 'sender_phone', {
        type: Sequelize.STRING(12),
        allowNull: true,
        after: 'sender_state'
      }, {
        transaction
      });

      await queryInterface.addColumn('machine_shipping_settings', 'sender_email', {
        type: Sequelize.STRING(100),
        allowNull: true,
        after: 'sender_phone'
      }, {
        transaction
      });

      await queryInterface.addColumn('machine_shipping_settings', 'declared_value', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        after: 'delivery_advicemment'
      }, {
        transaction
      });

      await queryInterface.renameColumn('machine_shipping_settings', 'origin_zipcode', 'sender_zipcode', {
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
      await queryInterface.removeColumn('machine_shipping_settings', 'correios_directorship_number', {
        transaction
      });

      await queryInterface.removeColumn('machine_shipping_settings', 'sender_name', {
        transaction
      });

      await queryInterface.removeColumn('machine_shipping_settings', 'sender_street', {
        transaction
      });

      await queryInterface.removeColumn('machine_shipping_settings', 'sender_number', {
        transaction
      });

      await queryInterface.removeColumn('machine_shipping_settings', 'sender_neighborhood', {
        transaction
      });

      await queryInterface.removeColumn('machine_shipping_settings', 'sender_city', {
        transaction
      });

      await queryInterface.removeColumn('machine_shipping_settings', 'sender_state', {
        transaction
      });

      await queryInterface.removeColumn('machine_shipping_settings', 'sender_phone', {
        transaction
      });

      await queryInterface.removeColumn('machine_shipping_settings', 'sender_email', {
        transaction
      });

      await queryInterface.removeColumn('machine_shipping_settings', 'declared_value', {
        transaction
      });

      await queryInterface.renameColumn('machine_shipping_settings', 'sender_zipcode', 'origin_zipcode', {
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
