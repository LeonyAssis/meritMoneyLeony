'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('communication_large_scale_notification_status', [{
      id: 1,
      title: 'Aguardando envio',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }, {
      id: 2,
      title: 'Realizando envio',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }, {
      id: 3,
      title: 'Falhou',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }, {
      id: 4,
      title: 'Envio cancelado',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }, {
      id: 5,
      title: 'Enviado',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('communication_large_scale_notification_status', null, {});
  }
};
