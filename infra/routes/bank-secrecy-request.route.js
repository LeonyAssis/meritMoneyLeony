'use strict';

module.exports = (app, ctrls, mdws) => {
  app.route('/bank-secrecy-request')
    .post(
      mdws.authorize,
      ctrls.bankSecrecyRequestController.create
    );

  app.route('/bank-secrecy-request')
    .get(
      mdws.authorize,
      ctrls.bankSecrecyRequestController.list
    );

  app.route('/bank-secrecy-request/:id')
    .put(
      mdws.authorize,
      ctrls.bankSecrecyRequestController.update
    );
};
