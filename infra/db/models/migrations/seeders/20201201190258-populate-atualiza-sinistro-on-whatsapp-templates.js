'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('whatsapp_templates', [{
      name: 'atualizacao_sinistro2',
      element_name: 'atualizacao_sinistro2',
      namespace: '947cc4c7_cd16_4423_8fd2_1db81e269b40',
      argument_size: 3,
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('whatsapp_templates', null, {});
  }
};
