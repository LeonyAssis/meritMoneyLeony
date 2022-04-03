'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('machine_chip_types', [{
      id: 1,
      type: '2FF',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }, {
      id: 2,
      type: '3FF',
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('machine_chip_type', null, {});
  }
};
