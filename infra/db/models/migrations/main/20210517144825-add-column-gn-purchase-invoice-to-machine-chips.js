'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.renameColumn('machine_chips', 'invoice', 'gn_purchase_invoice', {
      }, {
        transaction
      },
      );
      await queryInterface.addColumn(
        'machine_chips',
        'status', {
        type: Sequelize.ENUM('available', 'linked', 'defect'),
        defaultValue: 'available',
        allowNull: false,
        after: 'gn_purchase_invoice'
      }, {
        transaction
      },
      );
      await queryInterface.addColumn(
        'machine_chips',
        'defect_reported_by', {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: 'defect_at'
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
      await queryInterface.removeColumn('machine_chips',
        'gn_purchase_invoice', {
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
