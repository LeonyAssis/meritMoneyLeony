'use strict';

module.exports = (app, ctrls) => {
  app.route('/healthcheck')
    .get(ctrls.healthCheckController.run);
};
