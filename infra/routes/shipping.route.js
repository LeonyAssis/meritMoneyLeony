'use strict';

module.exports = (app, ctrls, mdws) => {
  app.route('/shipping/time_and_costs')
    .post(
      mdws.authorize,
      ctrls.shippingController.get_time_and_costs
    );
};
