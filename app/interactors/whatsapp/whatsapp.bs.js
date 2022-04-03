'use strict';

const Interactor = require('../interactor.bs');

class WhatsappBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.config = params.config;
    this.validator = params.validatorService;
    this.whatsappRepository = params.whatsappRepository;
    this.whatsappService = params.whatsappService;
  }

  async send(req) {
    this.validator.execute('whatsapp-send.json', req.body);
    let phone = req.body.phone;
    let user_id = req.body.user_id;
    let message_variables = req.body.message_variables;
    let template_name = req.body.template_name;
    let alternative_account = null;
    let whatsapp_phones_id = null;
    let link = req.body.link || null;
    let type_link = req.body.type_link || null;

    let template = await this.whatsappRepository.getTemplateArgs(template_name);

    if (!template)
      throw this.errorService
        .get('whatsapp_template_not_found');
    if (message_variables.length != template.argument_size)
      throw this.errorService
        .get('whatsapp_wrong_number_of_arguments');

    let whatsapp_phone = await this.whatsappRepository.getAlternativeAccountByPhone(phone);

    if (!whatsapp_phone) {
      let alternative_account_result = await this.whatsappService.getAlternativeAccount(phone);
      if (alternative_account_result.status == 'failure')
        throw this.errorService
          .get('cannot_get_alternative_account_from_server');

      alternative_account = alternative_account_result.resource.alternativeAccount;
      whatsapp_phones_id = await this.whatsappRepository.createWhatsappPhone(phone, alternative_account).then(res => res.id);
    } else {
      alternative_account = whatsapp_phone.alternative_account;
      whatsapp_phones_id = whatsapp_phone.id;
    }

    if (!alternative_account)
      throw this.errorService
        .get('cannot_get_alternative_account_from_database');

    let whatsapp_message_id = await this.whatsappRepository.createWhatsappMessage({
      arguments: message_variables,
      template: template.name
    }, whatsapp_phones_id, user_id, link, type_link, 'waiting').then(res => res.id);

    let message_result = await this.whatsappService.sendMessage(template, message_variables, alternative_account);
    if (message_result == 202) {
      await this.whatsappRepository.updateWhatsappMessageStatus(whatsapp_message_id, 'sent', message_result);
    } else {
      await this.whatsappRepository.updateWhatsappMessageStatus(whatsapp_message_id, 'error', message_result);
      throw this.errorService
        .get('whatsapp_message_send_has_failed');
    }
  }
}

module.exports = WhatsappBs;
