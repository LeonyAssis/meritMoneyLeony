'use strict';

module.exports = (app, ctrls, mdws) => {
  app.route('/users')
    .post(
      // mdws.authorize,
      ctrls.userController.createUser
    );

    app.route('/users')
    .get(
      // mdws.authorize,
      ctrls.userController.getUsers
    );

    app.route('/users/:id')
    .get(
      // mdws.authorize,
      ctrls.userController.getUser
    );
};
