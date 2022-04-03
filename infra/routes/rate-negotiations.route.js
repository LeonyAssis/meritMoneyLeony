'use strict';

module.exports = (app, ctrls, mdws) => {
  app.route('/rate-negotiations')
    .post(
      mdws.authorize,
      ctrls.rateNegotiationsController.create
    );

  app.route('/rate-negotiations')
    .get(
      mdws.authorize,
      ctrls.rateNegotiationsController.list
    );

  app.route('/rate-negotiations/configuration')
    .put(
      mdws.authorize,
      ctrls.rateNegotiationsController.configuration_update
    );

  app.route('/rate-negotiations/assign-responsible')
    .put(
      mdws.authorize,
      ctrls.rateNegotiationsController.assign_responsible
    );

  app.route('/rate-negotiations/:id/history')
    .get(
      mdws.authorize,
      ctrls.rateNegotiationsController.history
    );

  app.route('/rate-negotiations/number-requests')
    .get(
      mdws.authorize,
      ctrls.rateNegotiationsController.has_negotiations_in_period
    );

  app.route('/rate-negotiations/reasons')
    .get(
      mdws.authorize,
      ctrls.rateNegotiationsController.get_rate_negotiations_reasons
    );

  app.route('/rate-negotiations/:id')
    .get(
      mdws.authorize,
      ctrls.rateNegotiationsController.get
    );

  app.route('/rate-negotiations/counts')
    .post(
      mdws.authorize,
      ctrls.rateNegotiationsController.get_counts
    );

  app.route('/rate-negotiations/:id/change-responsible')
    .put(
      mdws.authorize,
      ctrls.rateNegotiationsController.change_responsible
    );
};
