'use strict';

class EmailRegisterService {

  constructor(params) {
    this.config = params.config;
    this.momentTz = params.momentTz;
    this.repository = params.emailRegisterRepository;
  }

  async physicalCardRequested(accountId) {
    const accountData = await this.repository
      .getAccountData(accountId);

    const template = 'physical-card-requested';

    const templateData = {
      profile_name: accountData.document.profile.name,
      request_date: this.momentTz
        .tz(this.config.timezone)
        .format('YYYY-MM-DD HH:mm:ss')
    };

    await this.repository
      .registerNewEmail(accountId, template, templateData);
  }

  async cardPermissionGranted(accountId) {
    const accountData = await this.repository
      .getAccountData(accountId);

    const template = 'card-permission-granted';

    const templateData = {
      profile_name: accountData.document.profile.name
    };

    await this.repository
      .registerNewEmail(accountId, template, templateData);
  }

  async cardIssuanceFail(accountId, errorMessage) {
    const accountData = await this.repository
      .getAccountData(accountId);

    const template = 'card-issuance-failed';

    const templateData = {
      profile_name: accountData.document.profile.name,
      error_message: errorMessage
    };

    await this.repository
      .registerNewEmail(accountId, template, templateData);
  }

  async registerBlockedCardEmail(accountId) {
    const accountData = await this.repository
      .getAccountData(accountId);

    const template = 'physical-card-blocked';

    const templateData = {
      profile_name: accountData.document.profile.name,
    };

    await this.repository
      .registerNewEmail(accountId, template, templateData);
  }

  async registerUnblockedCardEmail(accountId) {
    const accountData = await this.repository
      .getAccountData(accountId);

    const template = 'physical-card-unblocked';

    const templateData = {
      profile_name: accountData.document.profile.name,
    };

    await this.repository
      .registerNewEmail(accountId, template, templateData);
  }
}

module.exports = EmailRegisterService;
