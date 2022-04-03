'use strict';

const Interactor = require('../interactor.bs');

class CommunicationLargeScaleBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.communicationLargeScaleRepository = params.communicationLargeScaleRepository;
    this.communicationLargeScaleService = params.communicationLargeScaleService;
  }

  async create(req) {
    this.validator.execute('communication-large-scale.json', req.body);

    let communication_large_scale_options = await this.communicationLargeScaleService.
    getCommunicationLargeScaleOptions(req.body);

    let communication_large_scale_options_id = await this.communicationLargeScaleRepository
      .createCommunicationLargeScaleOption(communication_large_scale_options)
      .then(res => res.id);

    let communication_large_scale = await this.communicationLargeScaleService
      .getCommunicationLargeScale(req.body, communication_large_scale_options_id);

    await this.communicationLargeScaleRepository
      .createCommunicationLargeScale(communication_large_scale);
  }

  async generate(req) {

    let limit = parseInt(req.query.limit) || 20;
    let threadsNumber = parseInt(req.query.threads_number) || 5;

    let communication_large_scale = await this.communicationLargeScaleRepository
      .getCommunicationLargeScaleToPrepare()
      .then(res => {
        if (!res)
          throw this.errorService
            .get('cannot_get_communication_large_scale_to_generate');
        res.from = res.from.split(',').map(f => f.trim());
        return res;
      });

    let selectedThread = 1;
    let count = 0;
    let toProcess = communication_large_scale.total_amount_to_process;
    let processed = communication_large_scale.total_amount_processed;
    while (count < limit) {
      if (processed >= toProcess) {
        await this.communicationLargeScaleRepository
          .setCommunicationLargeScaleStatusAndProcessed(communication_large_scale.id, 3, 0);
        break;
      }
      await this.communicationLargeScaleRepository
        .createCommunicationLargeScaleNotification(communication_large_scale.id, communication_large_scale.from[processed], selectedThread);
      count++;
      processed++;
      selectedThread = selectedThread == threadsNumber ? 1 : selectedThread + 1;
    }
  }

  async send(req) {
    let limit = parseInt(req.query.limit) || 20;
    let balancing = parseInt(req.query.balancing) || 1;
    let error = req.query.error || false;

    if (error == 'true') {
      let failedNotifications = await this.communicationLargeScaleRepository
        .getNotificationsFailedToSend(limit);

      for (let failedNotification of failedNotifications) {
        if (failedNotification.communication_large_scale.communication_large_scale_option.communication_type == 'ticket') {
          let resp;
          if (failedNotification.communication_large_scale.communication_large_scale_option.type_from == 'account') {
            let passkey = await this.communicationLargeScaleRepository
              .getPassKeyByAccount(failedNotification.from_identificator);
            resp = await this.communicationLargeScaleService
              .sendTicketCommunication(passkey.users.passkey, failedNotification.communication_large_scale, failedNotification.from_identificator);
          } else {
            resp = await this.communicationLargeScaleService
              .sendTicketCommunicationProfile(failedNotification.from_identificator, failedNotification.communication_large_scale);
          }
          if (resp.status == '2') {
            await this.communicationLargeScaleRepository
              .setNotificationStatus(failedNotification.id, null, 5, resp.output.id);
          } else {
            await this.communicationLargeScaleRepository
              .setNotificationStatus(failedNotification.id, null, 3, resp.output.id);
          }
        }
      }

      return 200;
    }

    await this.communicationLargeScaleRepository
      .changeScheduleToOnSending(new Date());

    let communication_large_scale = await this.communicationLargeScaleRepository
      .getCommunicationLargeScaleToSend();

    if (!communication_large_scale)
      throw this.errorService
        .get('cannot_get_communication_large_scale_to_send');

    if (communication_large_scale.total_amount_processed == 0)
      await this.communicationLargeScaleRepository
      .setCommunicationLargeScaleStartedAt(communication_large_scale.id);

    else if (communication_large_scale.total_amount_processed == communication_large_scale.total_amount_to_process)
      await this.communicationLargeScaleRepository
      .setCommunicationLargeScaleFinishedAt(communication_large_scale.id);

    if (communication_large_scale.communication_large_scale_option.communication_type == 'ticket') {
      let communication_large_scale_notifications = await this.communicationLargeScaleRepository
        .getNotificationsToSend(communication_large_scale.id, limit, balancing);

      for (let communication_large_scale_notification of communication_large_scale_notifications) {
        let resp;
        if (communication_large_scale.communication_large_scale_option.type_from == 'account') {
          let passkey = await this.communicationLargeScaleRepository
            .getPassKeyByAccount(communication_large_scale_notification.from_identificator);
          resp = await this.communicationLargeScaleService
            .sendTicketCommunication(passkey.users.passkey, communication_large_scale, communication_large_scale_notification.from_identificator);
        } else {
          resp = await this.communicationLargeScaleService
            .sendTicketCommunicationProfile(communication_large_scale_notification.from_identificator, communication_large_scale);
        }
        if (resp.status == '2') {
          await this.communicationLargeScaleRepository
            .setNotificationStatus(communication_large_scale_notification.id, communication_large_scale.id, 5, resp.output.id);
        } else {
          await this.communicationLargeScaleRepository
            .setNotificationStatus(communication_large_scale_notification.id, communication_large_scale.id, 3, resp.output.id);
        }

      }
    }
  }
  async list(req) {
    let type = req.query.type;
    let term = req.query.term || '';
    let status = req.query.status;
    let limit = parseInt(req.query.limit) || 1000;
    let offset = ((parseInt(req.query.page_number) || 1) - 1) * limit;
    let order = req.query.order || 'desc';

    let pagination = {
      limit: limit,
      offset: offset,
      order: order
    };

    let communications_large_scale = await this.communicationLargeScaleRepository
      .getCommunicationLargeScaleReport(type, term, status, pagination);

    if (!communications_large_scale)
      throw this.errorService
        .get('cannot_list_communication_large_scale');

    for (let communication_large_scale of communications_large_scale) {
      if (communication_large_scale['communication_large_scale_option']['ticket_category_id'])
        communication_large_scale['communication_large_scale_option']['ticket_category_id'] = communication_large_scale['communication_large_scale_option']['ticket_category_id'].split(',');
    }

    return communications_large_scale;
  }

  async updateStatus(req) {
    let id = req.params.id;
    let new_status = req.query.status;
    let status_id = 0;

    let communication_large_scale = await this.communicationLargeScaleRepository
      .getCommunicationLargeScale(id);

    if (!communication_large_scale)
      throw this.errorService
        .get('cannot_get_communication_large_scale');

    if (new_status == 'pause') {
      if (communication_large_scale['communication_large_scale_status_id'] == 1)
        status_id = 2;
      else
        status_id = 4;
    } else if (new_status == 'cancel') {
      status_id = 5;
    } else if (new_status == 'resume') {
      if (communication_large_scale['communication_large_scale_status_id'] == 2)
        status_id = 1;
      else {
        if (communication_large_scale['scheduled_at'])
          status_id = 6;
        else
          status_id = 3;
      }
    }
    if (status_id > 0)
      await this.communicationLargeScaleRepository
      .updateCommunicationLargeScaleStatus(id, status_id);
  }

  async getStatus() {

    let status = await this.communicationLargeScaleRepository
      .getCommunicationLargeScaleStatus();

    if (!status)
      throw this.errorService
        .get('cannot_get_communication_large_scale_status');

    return status;
  }

  async validate(req) {
    this.validator.execute('communication-large-scale-validate.json', req.body);

    let {
      from,
      type_from
    } = req.body;

    from = from.map(f => f.trim());

    const errors = {};

    const duplicatedValuesTested = {};

    let valuesFounded = {};

    if (type_from == 'account') {
      valuesFounded = await this.communicationLargeScaleRepository
        .getAccountsNumber(from)
        .then(result => result.reduce((acc, r) => {
          acc[`${r.number}`] = true;
          return acc;
        }, {}));

    } else {
      valuesFounded = await this.communicationLargeScaleRepository
        .getProfiles(from)
        .then(result => result.reduce((acc, r) => {
          acc[`${r.id}`] = true;
          return acc;
        }, {}));
    }

    for (var i = 0; i < from.length; i++) {
      let value = from[i];

      let error = {};

      if (value in duplicatedValuesTested) {
        error.duplicated = true;
        const duplicatedRow = duplicatedValuesTested[value];
        if (errors[duplicatedRow]) {
          errors[duplicatedRow] = Object.assign(errors[duplicatedRow], error);
        } else {
          errors[duplicatedRow] = Object.assign({
            value: value,
            row: duplicatedRow
          }, error);
        }
      }
      duplicatedValuesTested[value] = i;

      if (!valuesFounded[value]) {
        error.not_found = true;
      }

      if (Object.keys(error).length) {
        error.value = value;
        error.row = i;
        errors[i] = error;
      }
    }

    const data = Object
      .keys(errors)
      .map(key => {
        const error = errors[key];
        const data = [];
        data.push(error.value);
        data.push(error.row + 1);
        data.push(error.not_found ? 'sim' : '');
        data.push(error.duplicated ? 'sim' : '');
        return data;
      });

    return {
      is_valid: !data.length,
      errors: data
    };
  }
}

module.exports = CommunicationLargeScaleBs;
