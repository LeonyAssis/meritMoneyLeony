'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('rate_negotiation_reasons', [{
      id: 1,
      title: 'Proposta do concorrente',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }, {
      id: 2,
      title: 'Aumento de recebimentos',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }, {
      id: 3,
      title: 'Valor do site está diferente',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }, {
      id: 4,
      title: 'Promoção da Gerencianet',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }, {
      id: 5,
      title: 'Tarifa de outro parceiro/colega',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }, {
      id: 6,
      title: 'Outros',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('rate_negotiation_types', null, {});
  }
};
