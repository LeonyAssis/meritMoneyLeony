'use strict';

module.exports = (app, ctrls) => {
  app.route('/robots/commercial-wallet/accounts-activate')
    .get(ctrls.commercialWalletAccountsActivateController.run);

  app.route('/robots/commercial-wallet/report-performance-tracking/generate')
    .get(ctrls.commercialWalletReportPerformanceTrackingController.generate);

  app.route('/robots/commercial-wallet/report-performance-tracking/send')
    .get(ctrls.commercialWalletReportPerformanceTrackingController.send);

  app.route('/robots/commercial-wallet/balancing')
    .get(ctrls.commercialWalletBalancingController.run);

  app.route('/robots/comunication/large-scale/generate')
    .get(ctrls.communicationLargeScaleController.generate);

  app.route('/robots/comunication/large-scale/send')
    .get(ctrls.communicationLargeScaleController.send);

  app.route('/robots/document/situations')
    .get(ctrls.documentSituationController.run);

  app.route('/robots/document/situations/block/:type')
    .get(ctrls.documentSituationController.block);

  app.route('/robots/control-claims/send-warning')
    .get(ctrls.controlClaimController.sendWarning);

  app.route('/robots/machine/activation')
    .get(ctrls.machineController.activateClient);

  app.route('/robots/account/rates/edit')
    .get(ctrls.accountNewRatesController.execute);

  app.route('/robots/account/rates/edit')
    .get(ctrls.accountNewRatesController.execute);

  app.route('/robots/correios/client-search')
    .get(
      ctrls.correiosController.clientSearch
    );
};
