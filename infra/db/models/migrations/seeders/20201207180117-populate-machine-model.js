'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('machine_models', [{
      id: 1,
      model: 'D195',
      quantity_coil: 0,
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }, {
      id: 2,
      model: 'S920',
      quantity_coil: 3,
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('machine_model', null, {});
  }
};
