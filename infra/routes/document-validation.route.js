'use strict';

module.exports = (app, ctrls, mdws) => {
  app.route('/document-validation/markup')
    .get(
      mdws.authorize,
      ctrls.documentValidationMarkupController.getLastMarkup
    );

  app.route('/document-validation/markup')
    .post(
      mdws.authorize,
      ctrls.documentValidationMarkupController.create
    );
};
