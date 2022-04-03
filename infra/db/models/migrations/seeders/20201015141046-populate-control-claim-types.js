'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('control_claim_types', [{
      id: 1,
      title: 'Sistema Gerencianet',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }, {
      id: 2,
      title: 'Outros',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }], {});
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete('control_claim_types', null, {});
  }
};
