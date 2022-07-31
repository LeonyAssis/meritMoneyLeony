'use strict';

module.exports = (app, ctrls, mdws) => {
  app.route('/benefits')
    .get(
      mdws.authorize,
      ctrls.benefitsController.getBenefits
    );

  app.route('/benefits/:id')
    .get(
      mdws.authorize,
      ctrls.benefitsController.getBenefit
    );

  app.route('/benefits')
    .post(
      mdws.authorize,
      ctrls.benefitsController.upsertBenefits
    );

  app.route('/benefits/:id')
    .put(
      mdws.authorize,
      ctrls.benefitsController.updateBenefits
    );

  app.route('/benefits/buy')
    .post(
      mdws.authorize,
      ctrls.benefitsController.buyBenefits
    );
};
