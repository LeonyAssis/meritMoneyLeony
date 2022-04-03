'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('communication_large_scale_status', [{
      id: 1,
      title: 'Preparando comunicação',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }, {
      id: 2,
      title: 'Preparo pausado',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }, {
      id: 3,
      title: 'Enviando comunicação',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }, {
      id: 4,
      title: 'Envio pausado',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }, {
      id: 5,
      title: 'Comunicação cancelada',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }, {
      id: 6,
      title: 'Agendada',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    },
    {
      id: 7,
      title: 'Enviado',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }
    ], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('communication_large_scale_status', null, {});
  }
};
