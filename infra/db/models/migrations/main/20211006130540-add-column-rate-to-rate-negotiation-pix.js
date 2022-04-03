'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('rate_negotiation_pix', 'rate', {
      type: Sequelize.JSON,
      allowNull: true,
      after: 'rate_negotiations_id'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('rate_negotiation_pix', 'rate');
  }
};

