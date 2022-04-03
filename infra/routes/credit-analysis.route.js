'use strict';

module.exports = (app, ctrls, mdws) => {
  app.route('/credit-analysis/history/request/:request_id')
    .get(
      mdws.authorize,
      ctrls.creditAnalysisHistoryController.get_request
    );

  app.route('/credit-analysis/history/name/responsible')
    .get(
      mdws.authorize,
      ctrls.creditAnalysisHistoryController.get_responsible
    );

  app.route('/credit-analysis/history/request')
    .post(
      mdws.authorize,
      ctrls.creditAnalysisHistoryController.create
    );
};
