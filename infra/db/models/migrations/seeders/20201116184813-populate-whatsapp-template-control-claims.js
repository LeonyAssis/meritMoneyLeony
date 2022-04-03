'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('whatsapp_templates', [{
      name: 'comentario_sinistro',
      element_name: 'comentario_sinistro',
      namespace: '947cc4c7_cd16_4423_8fd2_1db81e269b40',
      argument_size: 3,
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }, {
      name: 'atualizacao_sinistro',
      element_name: 'atualizacao_sinistro',
      namespace: '947cc4c7_cd16_4423_8fd2_1db81e269b40',
      argument_size: 4,
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }, {
      name: 'novo_sinistro',
      element_name: 'novo_sinistro',
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
