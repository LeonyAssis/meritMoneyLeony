'use strict';

module.exports = (app, ctrls, mdws) => {
  app.route('/commercial-wallets')
    .post(
      mdws.authorize,
      ctrls.commercialWalletController.create
    );

  app.route('/commercial-wallet/notes')
    .post(
      mdws.authorize,
      ctrls.commercialWalletNotesController.create
    );

  app.route('/commercial-wallet/:commercial_wallet_id/notes')
    .get(
      mdws.authorize,
      ctrls.commercialWalletNotesController.list
    );

  app.route('/commercial-wallet/note-types')
    .get(
      mdws.authorize,
      ctrls.commercialWalletNoteTypesController.list
    );

  app.route('/commercial-wallet/status')
    .post(
      mdws.authorize,
      ctrls.commercialWalletStatusController.create
    );

  app.route('/commercial-wallet/:commercial_wallet_id/status')
    .get(
      mdws.authorize,
      ctrls.commercialWalletStatusController.list
    );

  app.route('/commercial-wallet/document/:document')
    .get(
      mdws.authorize,
      ctrls.commercialWalletController.get
    );

  app.route('/commercial-wallet/document/:document/notes')
    .get(
      mdws.authorize,
      ctrls.commercialWalletNotesController.listbydocument
    );

  app.route('/commercial-wallet/document/:document/status')
    .get(
      mdws.authorize,
      ctrls.commercialWalletStatusController.listbydocument
    );

  app.route('/commercial-wallet/status-types')
    .get(
      mdws.authorize,
      ctrls.commercialWalletStatusTypesController.list
    );

  app.route('/commercial-wallet/report-performance-tracking')
    .get(
      mdws.authorize,
      ctrls.commercialWalletReportPerformanceTrackingController.list
    );

  app.route('/commercial-wallet/resume')
    .get(
      mdws.authorize,
      ctrls.commercialWalletReportPerformanceTrackingController.resume
    );

    app.route('/commercial-wallets/:id/type')
    .put(
      mdws.authorize,
      ctrls.commercialWalletController.update_type
    );

  app.route('/commercial-wallets/:id/transfer')
    .put(
      mdws.authorize,
      ctrls.commercialWalletController.update_responsible
    );

  app.route('/commercial-wallets/:id/analyses')
    .put(
      mdws.authorize,
      ctrls.commercialWalletController.update_analyses
    );

  app.route('/commercial-wallets/:id/sizes')
    .put(
      mdws.authorize,
      ctrls.commercialWalletController.update_account_size
    );
};
