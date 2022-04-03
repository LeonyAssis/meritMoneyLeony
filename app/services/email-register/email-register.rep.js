'use strict';

class EmailSenderRepository {

  constructor(params) {
    this.db = params.sequelize;
    this.EMAIL_REGISTER_STATUS = params.constants.EMAIL_REGISTER_STATUS;
  }

  async getAccountData(accountId) {
    const options = {
      where: {
        id: accountId
      },
      attributes: ['number', 'email', 'nickname', 'phone'],
      include: [{
        model: this.db.core.document,
        attributes: ['id'],
        required: true,
        include: [{
          model: this.db.core.profile,
          attributes: ['name', 'cpf'],
          required: true,
        }]
      }]
    };

    return this.db.core
      .account
      .findOne(options);
  }

  async registerNewEmail(accountId, template, templateData, t) {
    const newEmailRegister = {
      account_id: accountId,
      template: template,
      template_data: JSON.stringify(templateData),
      status: this.EMAIL_REGISTER_STATUS.WAITING,
      attempts: 0
    };

    const options = {};

    if (t) {
      options.transaction = t;
    }

    return this.db.main
      .email_register
      .create(newEmailRegister, options);
  }

}

module.exports = EmailSenderRepository;
