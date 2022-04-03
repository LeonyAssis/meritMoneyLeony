'use strict';

const Interactor = require('../interactor.bs');

class MachineAlertsBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.transactionService = params.transactionService;
    this.machineAlertsRepository = params.machineAlertsRepository;
    this.machineAlertsService = params.machineAlertsService;
  }

  async getAlerts(req) {
    let paramsQuery = await this.machineAlertsService
      .getParametersList(req.query);

    let alerts = await this.machineAlertsRepository
      .getAlerts(paramsQuery);

    alerts = await this.machineAlertsService
      .getResponsible(alerts);

    return alerts;
  }

  async getAlert(req) {
    const id = req.params.id;

    let alert = await this.machineAlertsRepository
      .getAlert(id);

    if (!alert)
      throw this.errorService
        .get('alert_not_found');

    alert = await this.machineAlertsService
      .getResponsible(alert);

    let clientInfo = await this.machineAlertsRepository
      .getClientInfoAlert(alert.acc_number);

    if (!clientInfo)
      throw this.errorService
        .get('client_not_found');

    alert.account = clientInfo;

    return alert;
  }

  async evaluateAlert(req) {
    await this.validator.execute('machine-alert-evaluate.json', req.body);

    const alert = await this.machineAlertsRepository
      .getAlert(req.params.id);

    if (!alert)
      throw this.errorService
        .get('alert_not_found');

    const account = await this.machineAlertsService
      .getAlertAccount(alert.id);

    if (!account)
      throw this.errorService
        .get('client_not_found');

    const passkey = await this.machineAlertsRepository
      .getAccPasskey(account.id)
      .then(p => p.passkey);

    if (['fraud', 'suspect'].includes(req.body.status)) {
      await this.machineAlertsService
        .blockDocument(account, req.body, passkey);
    }

    if (req.body.status != 'rejected') {
      const statusOptions = {
        fraud: 'Fraude',
        suspect: 'Suspeita de fraude',
        alert_chargeback: 'Alerta de chargeback',
        alert_fraud: 'Alerta de fraude'
      };

      const user = await this.machineAlertsRepository
        .getUser(req.body.user_id);

      await this.machineAlertsService
        .createInternalAlertTicketCommunication(
          alert,
          account.id,
          passkey,
          {
            reason: req.body.reason,
            status: statusOptions[req.body.status],
            name: user.name
          }
        );
    }

    await this.machineAlertsRepository
      .updateAlert(alert.id, {
        status: req.body.status
      });

    await this.machineAlertsRepository
      .createAlertLog({
        alert_id: alert.id,
        user_id: req.body.user_id,
        status_old: alert.status,
        status_new: req.body.status,
        reason: req.body.reason
      });

    await this.machineAlertsRepository
      .createStatusAlertHistory({
        pos_alert_id: alert.id,
        user_id: req.body.user_id,
        status_old: alert.status,
        status_new: req.body.status,
        reason: req.body.reason
      });
  }

  async createAlertNote(req) {
    await this.validator.execute('machine-alert-create-notes.json', req.body);

    const alert = await this.machineAlertsRepository
      .getAlert(req.params.id);

    if (!alert)
      throw this.errorService
        .get('alert_not_found');

    const account = await this.machineAlertsService
      .getAlertAccount(alert.id);

    if (!account)
      throw this.errorService
        .get('client_not_found');

    const note = req.body;

    note.account_id = account.id;

    await this.machineAlertsRepository
      .createNote(note);
  }

  async getAlertNotes(req) {
    const alert = await this.machineAlertsRepository
      .getAlert(req.params.id);

    if (!alert)
      throw this.errorService
        .get('alert_not_found');

    const account = await this.machineAlertsService
      .getAlertAccount(alert.id);

    if (!account)
      throw this.errorService
        .get('client_not_found');

    const notes = await this.machineAlertsRepository
      .getNotes(account.id);

    if (notes.length == 0)
      throw this.errorService
        .get('no_alert_notes_for_this_account');

    return notes;
  }

  async getTicketAlert(req) {
    const ticket_id = req.params.ticket_id;

    let alert = await this.machineAlertsRepository
      .getAlertIdByTicket(ticket_id);

    if (!alert)
      throw this.errorService
        .get('alert_not_found');

    return alert;
  }

  async getTicketsByAlert(req) {
    let alert = await this.machineAlertsRepository
      .getAlert(req.params.id);

    if (!alert)
      throw this.errorService
        .get('alert_not_found');

    const account = await this.machineAlertsService
      .getAlertAccount(alert.id);

    if (!account)
      throw this.errorService
        .get('client_not_found');

    const tickets = await this.machineAlertsRepository
      .getTicketsByAccountId(account.id);

    return {
      tickets_id: tickets.map(t => t.ticket_id)
    };
  }

  async markupAlert(req) {
    await this.validator.execute('machine-alert-markup.json', req.body);

    const alert = await this.machineAlertsRepository
      .getAlert(req.params.id);

    if (!alert)
      throw this.errorService
        .get('alert_not_found');

    await this.machineAlertsService
      .markAlert(alert, req.body);
  }

  async unmarkAlert(req) {
    await this.validator.execute('machine-alert-unmark.json', req.body);

    const alert = await this.machineAlertsRepository
      .getAlert(req.params.id);

    if (!alert)
      throw this.errorService
        .get('alert_not_found');

    await this.machineAlertsService
      .unmarkAlert(alert, req.body);
  }

}

module.exports = MachineAlertsBs;
