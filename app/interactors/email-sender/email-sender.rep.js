'use strict';

class EmailSenderRepository {

  constructor(params) {
    this.db = params.sequelize;

    this.EMAIL_REGISTER_STATUS = params.constants.EMAIL_REGISTER_STATUS;
    this.MAX_ATTEMPTS = params.config.email.max_attempts;
  }

  async getAccountData(accountId) {
    const options = {
      where: {
        id: accountId
      },
      attributes: ['number', 'email', 'nickname']
    };

    return this.db.core
      .account
      .findOne(options);
  }

  async getProfileEmail(accountId) {
    const account = await this.db.core
      .account
      .findOne({
        where: {
          id: accountId
        },
        attributes: ['document_id']
      });

    const profile = await this.db.core
      .document
      .findOne({
        include: [{
          model: this.db.core.profile,
          attributes: []
        }],
        where: {
          id: account.document_id
        },
        attributes: [[this.db.core.sequelize.col('profile.email'), 'email']],
        raw: true
      });

    return profile.email;
  }

  async getNextWaitingEmailRegister() {
    const Op = this.db.Sequelize.Op;

    const options = {
      where: {
        status: this.EMAIL_REGISTER_STATUS.WAITING,
        attempts: {
          [Op.lt]: this.MAX_ATTEMPTS
        }
      },
      order: [
        ['updated_at', 'ASC']
      ]
    };

    return this.db.main
      .email_register
      .findOne(options);
  }

  async updateStatusToProcessing(emailRegister, attempts) {
    const updateData = {
      status: this.EMAIL_REGISTER_STATUS.PROCESSING,
      attempts: attempts
    };

    const options = {
      where: {
        id: emailRegister.id,
        status: this.EMAIL_REGISTER_STATUS.WAITING
      }
    };

    return this.db.main
      .email_register
      .update(updateData, options)
      .then((affectedRows) => {
        return affectedRows[0] === 1;
      });
  }

  async updateStatusToSent(emailRegister, lastResponse, sentAt) {
    const updateData = {
      status: this.EMAIL_REGISTER_STATUS.SENT,
      last_response: JSON.stringify(lastResponse),
      sent_at: sentAt
    };

    const options = {
      where: {
        id: emailRegister.id
      }
    };

    return this.db.main
      .email_register
      .update(updateData, options);
  }

  async _updateStatusAndLastResponse(emailRegister, newStatus, lastResponse) {
    const updateData = {
      status: newStatus,
      last_response: JSON.stringify(lastResponse)
    };

    const options = {
      where: {
        id: emailRegister.id
      }
    };

    return this.db.main
      .email_register
      .update(updateData, options);
  }

  async updateStatusToWaiting(emailRegister, lastResponse) {
    return this._updateStatusAndLastResponse(emailRegister, this.EMAIL_REGISTER_STATUS.WAITING, lastResponse);
  }

  async updateStatusToError(emailRegister, lastResponse) {
    return this._updateStatusAndLastResponse(emailRegister, this.EMAIL_REGISTER_STATUS.ERROR, lastResponse);
  }

}

module.exports = EmailSenderRepository;
