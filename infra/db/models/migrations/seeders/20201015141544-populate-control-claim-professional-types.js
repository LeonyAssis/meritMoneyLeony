'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('control_claim_professional_types', [{
      id: 1,
      title: 'Atualização de Sinistro',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }, {
      id: 2,
      title: 'Técnico',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }, {
      id: 3,
      title: 'Comunicação',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }, {
      id: 4,
      title: 'Infra',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW'),
    }, {
      id: 5,
      title: 'Acompanhamento',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW'),
    }], {});
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete('control_claim_professional_types', null, {});
  }
};
