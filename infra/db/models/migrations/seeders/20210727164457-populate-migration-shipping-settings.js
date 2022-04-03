'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('machine_shipping_settings', [{
      company: 'CORREIOS',
      sender_zipcode: '35400000',
      self_hand: true,
      delivery_advicemment: true,
      calc_time_and_cost: true,
      created_at: Sequelize.fn('NOW'),
      updated_at: Sequelize.fn('NOW')
    }], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('machine_shipping_settings', null, {});
  }
};
