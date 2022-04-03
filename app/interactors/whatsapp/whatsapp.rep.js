'use strict';
class WhatsappRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async createWhatsappPhone(phone, alternative_account) {
    let whatsapp_phone = {
      phone: phone,
      alternative_account: alternative_account
    };
    return this.db.main
      .whatsapp_phones
      .create(whatsapp_phone);
  }

  async createWhatsappMessage(message_variables, whatsapp_phones_id, user_id, link, type_link, status) {
    let whatsapp_message = {

      message_variables: message_variables,
      whatsapp_phones_id: whatsapp_phones_id,
      user_id: user_id,
      link: link,
      type_link: type_link,
      status: status,
    };

    return this.db.main
      .whatsapp_messages
      .create(whatsapp_message);
  }

  async updateWhatsappMessageStatus(id, status, output) {
    const options = {
      where: {
        id: id
      }
    };
    const update = {
      status: status,
      output: {
        code: output
      }
    };
    return this.db.main
      .whatsapp_messages
      .update(update, options);
  }

  async getAlternativeAccountByPhone(phone) {
    const options = {
      where: {
        phone: phone,
      },
      raw: true,
    };
    return this.db.main
      .whatsapp_phones
      .findOne(options);
  }

  async getTemplateArgs(template_name) {
    const options = {
      where: {
        name: template_name,
      },
      raw: true,
    };
    return this.db.main
      .whatsapp_templates
      .findOne(options);
  }
}
module.exports = WhatsappRepository;
