'use strict';

module.exports = (app, ctrls, mdws) => {
  app.route('/document-analyses/classification')
    .post(
      mdws.authorize,
      ctrls.documentAnalysesClassificationController.create
    );

  app.route('/document-analyses/classification/document/:document')
    .get(
      mdws.authorize,
      ctrls.documentAnalysesClassificationController.get
    );
};
