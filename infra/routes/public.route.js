'use strict';

module.exports = (app, ctrls, mdws) => {
  app.route('/auth')
    .get(
      ctrls.authController.generateToken
    );
};
