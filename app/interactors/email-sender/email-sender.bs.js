'use strict';

class EmailSenderBs {

  constructor(params) {
    this.repository = params.emailSenderRepository;
    this.emailService = params.emailService;
    this.momentTz = params.momentTz;
    this.config = params.config;
    this.errorService = params.errorService;
    this.MAX_ATTEMPTS = params.config.email.max_attempts;
  }

  async execute() {
    const emailRegister = await this.repository
      .getNextWaitingEmailRegister();

    if (!emailRegister) {
      throw this.errorService
        .get('no_waiting_email_register');
    }

    emailRegister.attempts++;

    const canProcess = await this.repository
      .updateStatusToProcessing(emailRegister, emailRegister.attempts);

    if (!canProcess) {
      throw this.errorService
        .get('email_register_status_changed', emailRegister.id);
    }

    const accountData = await this.repository
      .getAccountData(emailRegister.account_id);

    const template = emailRegister.template;
    const templateData = JSON.parse(emailRegister.template_data);

    if (template === 'card-permission-granted') {
      accountData.email = await this.repository.getProfileEmail(emailRegister.account_id);
    }

    try {
      var response = await this.emailService
        .sendEmail(accountData, template, templateData);
    } catch (error) {
      response = error;
    }

    if (response.StatusCod === '2') {
      const sentAt = this.momentTz()
        .tz(this.config.timezone)
        .toDate();

      await this.repository
        .updateStatusToSent(emailRegister, response, sentAt);
    } else {
      if (emailRegister.attempts < this.MAX_ATTEMPTS) {
        await this.repository
          .updateStatusToWaiting(emailRegister, response);
      } else {
        await this.repository
          .updateStatusToError(emailRegister, response);
      }
    }
  }

}

module.exports = EmailSenderBs;
