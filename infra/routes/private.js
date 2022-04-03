'use strict';

module.exports = (app, ctrls, mdws) => {
  app.route('/version')
    .get(
      ctrls.commercialWalletController.version
    );

  app.route('/account-relationship/:account')
    .get(
      mdws.authorize,
      ctrls.accountRelationshipsController.get
    );

  app.route('/call-history-managers/manager/:id')
    .get(
      mdws.authorize,
      ctrls.callHistoryManagersController.list_by_manager
    );

  app.route('/account/:account/billet/new/rate')
    .get(
      mdws.authorize,
      ctrls.accountNewRatesController.get
    );
};
