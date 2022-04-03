'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    let transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addColumn('machine_invoices', 'value', {
        type: DataTypes.INTEGER,
        allowNull: false,
        after: 'invoice'
      }, {
        transaction
      });

      await transaction.commit();
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
      await queryInterface.removeColumn('machine_invoices', 'value', {
        transaction
      });

      await transaction.commit();
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      return Promise.reject(err);
    }
  }
};
