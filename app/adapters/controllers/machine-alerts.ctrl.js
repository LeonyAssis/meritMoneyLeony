'use strict';

module.exports = () => {
  return {

    get_alerts: async (req, res, next) => {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      const machineAlertsBs = req.scope
        .resolve('machineAlertsBs');

      try {
        let alerts = await machineAlertsBs.
          getAlerts(req);

        res.status(200).
          send({
            alerts: alerts.rows,
            currentPage: page,
            pages: Math.ceil(alerts.count / limit),
            numOfResults: alerts.count,
            limit: limit
          });
      } catch (err) {
        next(err);
      }
    },

    get_alert: async (req, res, next) => {
      const machineAlertsBs = req.scope
        .resolve('machineAlertsBs');

      try {
        let alert = await machineAlertsBs.
          getAlert(req);

        res.status(200).
          send(alert);
      } catch (err) {
        next(err);
      }
    },

    create_alert_note: async (req, res, next) => {
      const machineAlertsBs = req.scope
        .resolve('machineAlertsBs');

      try {
        await machineAlertsBs.
          createAlertNote(req);
        res.status(200).
          send('200');
      } catch (err) {
        next(err);
      }
    },

    get_alert_notes: async (req, res, next) => {
      const machineAlertsBs = req.scope
        .resolve('machineAlertsBs');

      try {
        let notes = await machineAlertsBs.
          getAlertNotes(req);
        res.status(200).
          send(notes);
      } catch (err) {
        next(err);
      }
    },

    evaluate_alert: async (req, res, next) => {
      const machineAlertsBs = req.scope
        .resolve('machineAlertsBs');

      try {
        await machineAlertsBs.
          evaluateAlert(req);
        res.status(200).
          send('200');
      } catch (err) {
        next(err);
      }
    },

    get_ticket_alert: async (req, res, next) => {
      const machineAlertsBs = req.scope
        .resolve('machineAlertsBs');

      try {
        let alert = await machineAlertsBs.
          getTicketAlert(req);

        res.status(200).
          send(alert);
      } catch (err) {
        next(err);
      }
    },

    get_tickets_by_alert: async (req, res, next) => {
      const machineAlertsBs = req.scope
        .resolve('machineAlertsBs');

      try {
        let alert = await machineAlertsBs.
          getTicketsByAlert(req);

        res.status(200).
          send(alert);
      } catch (err) {
        next(err);
      }
    },

    markup_alert: async (req, res, next) => {
      const machineAlertsBs = req.scope
        .resolve('machineAlertsBs');

      try {
        await machineAlertsBs
          .markupAlert(req);
        res.status(200).
          send('200');
      } catch (err) {
        next(err);
      }
    },

    unmark_alert: async (req, res, next) => {
      const machineAlertsBs = req.scope
        .resolve('machineAlertsBs');

      try {
        await machineAlertsBs
          .unmarkAlert(req);
        res.status(200).
          send('200');
      } catch (err) {
        next(err);
      }
    },

  };
};
