'use strict';

module.exports = {
  up: async (queryInterface) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('rate_negotiation_pix', 'tax_type', {
        transaction
      });

      await queryInterface.removeColumn('rate_negotiation_pix', 'tax_val_percentage', {
        transaction
      });

      await queryInterface.removeColumn('rate_negotiation_pix', 'tax_roof', {
        transaction
      });

      await queryInterface.removeColumn('rate_negotiation_pix', 'tax_val_money', {
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



