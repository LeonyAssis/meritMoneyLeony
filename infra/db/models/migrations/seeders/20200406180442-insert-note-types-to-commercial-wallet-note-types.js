'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('commercial_wallet_note_types', [{
      id: 7,
      name: 'teste',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }], {});
  },

  down: function (queryInterface) {
    return queryInterface.bulkDelete('commercial_wallet_note_types', null, {});
  }
};
