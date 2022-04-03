'use strict';

module.exports = (app, ctrls, mdws) => {
  app.route('/whatsapp/send')
    .post(
      mdws.authorize,
      ctrls.whatsappController.send
    );
};
