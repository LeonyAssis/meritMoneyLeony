'use strict';

module.exports = (app, ctrls, mdws) => {
  app.route('/reports/lesta/analyst-ticket-info')
    .get(
      mdws.authorize,
      ctrls.reportsLestaController.get_analyst_queue_ticket_info
    );
};
