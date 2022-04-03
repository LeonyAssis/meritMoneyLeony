'use strict';

module.exports = (app, ctrls, mdws) => {
  app.route('/correios/address-info/:zipcode')
    .get(
      mdws.authorize,
      ctrls.correiosController.address_info_by_zipcode
    );
};
