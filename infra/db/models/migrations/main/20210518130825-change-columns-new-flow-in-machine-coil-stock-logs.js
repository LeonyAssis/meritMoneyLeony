'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.renameColumn('machine_coil_stock_logs', 'quantity', 'amount', {
      }, {
        transaction
      });

      await queryInterface.renameColumn('machine_coil_stock_logs', 'invoice', 'gn_purchase_invoice', {
      }, {
        transaction
      });

      await queryInterface.changeColumn('machine_coil_stock_logs', 'origin', {
        type: Sequelize.ENUM('Tiliform', 'Gerencianet'),
        allowNull: false
      }, {
        transaction
      });

      await queryInterface.renameColumn('machine_coil_stock_logs', 'destiny', 'machine_client_id', {
      }, {
        transaction
      },
      );

      await queryInterface.changeColumn('machine_coil_stock_logs', 'machine_client_id', {
        type: Sequelize.INTEGER,
        allowNull: true
      }, {
        transaction
      });

      await queryInterface.addIndex('machine_coil_stock_logs', ['machine_client_id'], {
        transaction
      });

      await queryInterface.removeColumn('machine_coil_stock_logs', 'profile_id', {
        transaction
      });

      await queryInterface.removeColumn('machine_coil_stock_logs', 'account_id', {
        transaction
      });

      await queryInterface.removeColumn('machine_coil_stock_logs', 'machine_model_id', {
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
      await queryInterface.renameColumn('machine_coil_stock_logs', 'amount', 'quantity', {
      }, {
        transaction
      });

      await queryInterface.changeColumn('machine_coil_stock_logs', 'origin', {
        type: Sequelize.STRING(45),
        allowNull: false
      }, {
        transaction
      });

      await queryInterface.removeIndex('machine_coil_stock_logs', 'machine_coil_stock_logs_machine_client_id');

      await queryInterface.renameColumn('machine_coil_stock_logs', 'machine_client_id', 'destiny', {
      }, {
        transaction
      });

      await queryInterface.changeColumn('machine_coil_stock_logs', 'destiny', {
        type: Sequelize.STRING(45),
        allowNull: false
      }, {
        transaction
      });

      await queryInterface.addColumn('machine_coil_stock_logs', 'profile_id', {
        type: Sequelize.INTEGER,
        allowNull: true
      }, {
        transaction
      });

      await queryInterface.addColumn('machine_coil_stock_logs', 'account_id', {
        type: Sequelize.INTEGER,
        allowNull: true
      }, {
        transaction
      });

      await queryInterface.addColumn('machine_coil_stock_logs', 'machine_model_id', {
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
  }
};
