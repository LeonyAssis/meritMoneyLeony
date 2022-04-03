'use strict';

module.exports = (app, ctrls, mdws) => {
  app.route('/communication/large-scale')
    .post(
      mdws.authorize,
      ctrls.communicationLargeScaleController.create
    );

  app.route('/communication/large-scale/validate')
    .post(
      mdws.authorize,
      ctrls.communicationLargeScaleController.validate
    );

  app.route('/communication/large-scale')
    .get(
      mdws.authorize,
      ctrls.communicationLargeScaleController.list
    );

  app.route('/communication/large-scale/:id')
    .put(
      mdws.authorize,
      ctrls.communicationLargeScaleController.updateStatus
    );

  app.route('/communication/large-scale/status')
    .get(
      mdws.authorize,
      ctrls.communicationLargeScaleController.getStatus
    );
};
