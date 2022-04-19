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

    app.route('/users/:userId([0-9]{1,30})')
    .get(
      // mdws.authorize,
      ctrls.userController.getUser
    );

    app.route('/users/:userId([0-9]{1,30})')
    .put(
      // mdws.authorize,
      ctrls.userController.updateUser
    );
};
