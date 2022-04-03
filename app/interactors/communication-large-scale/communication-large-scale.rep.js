'use strict';
class CommunicationLargeScaleRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async createCommunicationLargeScaleOption(communication_large_scale_options) {

    return this.db.main
      .communication_large_scale_options
      .create(communication_large_scale_options);
  }
  async createCommunicationLargeScale(communication_large_scale) {

    return this.db.main
      .communication_large_scale
      .create(communication_large_scale);
  }
  async getCommunicationLargeScaleToPrepare() {
    const options = {
      where: {
        communication_large_scale_status_id: 1,
      },
      raw: true,
      order: [
        ['id', 'ASC']
      ],
    };
    return this.db.main
      .communication_large_scale
      .findOne(options);
  }

  async setCommunicationLargeScaleStatusAndProcessed(id, new_status, processed) {
    const options = {
      where: {
        id: id,
      }
    };
    const update = {
      communication_large_scale_status_id: new_status,
      total_amount_processed: processed,
    };
    return this.db.main
      .communication_large_scale
      .update(update, options);
  }

  async setNotificationStatus(id, communication_large_scale_id, new_status, ticket_id) {

    if (communication_large_scale_id != null) {
      await this.db.main
        .communication_large_scale
        .increment({
          total_amount_processed: 1
        }, {
          where: {
            id: communication_large_scale_id
          }
        });
    }

    await this.db.main
      .communication_large_scale_notifications
      .increment({
        attempts: 1
      }, {
        where: {
          id: id
        }
      });

    const options = {
      where: {
        id: id,
      }
    };
    const update = {
      communication_large_scale_notification_status_id: new_status,
      ticket_id: ticket_id,
      processed_at: new Date()
    };
    return await this.db.main
      .communication_large_scale_notifications
      .update(update, options);
  }

  async createCommunicationLargeScaleNotification(communication_large_scale_id, from_id, balancing, ) {
    let communication_large_scale_notification = {
      communication_large_scale_id: communication_large_scale_id,
      from_identificator: from_id,
      balancing: balancing,
      attempts: 0,
      ticket_id: null,
      processed_at: null,
      communication_large_scale_notification_status_id: 1
    };

    this.db.main
      .communication_large_scale
      .increment({
        total_amount_processed: 1
      }, {
        where: {
          id: communication_large_scale_id
        }
      });

    return this.db.main
      .communication_large_scale_notifications
      .create(communication_large_scale_notification);
  }

  async getCommunicationLargeScaleToSend() {
    const options = {
      where: {
        communication_large_scale_status_id: 3,
      },
      include: [{
        model: this.db.main.communication_large_scale_options,
        required: true,
      }],
      raw: true,
      nest: true,
      order: [
        ['id', 'ASC']
      ],
    };
    return this.db.main
      .communication_large_scale
      .findOne(options);
  }

  async changeScheduleToOnSending(now) {
    const Op = this.db.Sequelize.Op;
    const options = {
      where: {
        scheduled_at: {
          [Op.lte]: now
        },
        communication_large_scale_status_id: 6
      }
    };
    const update = {
      communication_large_scale_status_id: 1,
    };
    return this.db.main
      .communication_large_scale
      .update(update, options);
  }

  async setCommunicationLargeScaleStartedAt(id) {
    const options = {
      where: {
        communication_large_scale_status_id: 3,
        id: id
      }
    };
    const update = {
      started_at: new Date(),
    };
    return this.db.main
      .communication_large_scale
      .update(update, options);
  }

  async setCommunicationLargeScaleFinishedAt(id) {
    const options = {
      where: {
        communication_large_scale_status_id: 3,
        id: id
      }
    };
    const update = {
      finished_at: new Date(),
      communication_large_scale_status_id: 7
    };
    return this.db.main
      .communication_large_scale
      .update(update, options);
  }

  async getNotificationsToSend(communication_large_scale_id, limit, balancing) {
    const options = {
      where: {
        communication_large_scale_id: communication_large_scale_id,
        communication_large_scale_notification_status_id: 1,
        balancing: balancing
      },
      limit: limit
    };
    return this.db.main
      .communication_large_scale_notifications
      .findAll(options);
  }

  async getNotificationsFailedToSend(limit) {
    const Op = this.db.Sequelize.Op;
    const options = {
      where: {
        communication_large_scale_notification_status_id: 3,
        attempts: {
          [Op.lt]: 6
        },
      },
      include: [{
        model: this.db.main.communication_large_scale,
        required: true,
        include: [{
          model: this.db.main.communication_large_scale_options,
          required: true,
        }],
      }],
      raw: true,
      nest: true,
      limit: limit
    };
    return this.db.main
      .communication_large_scale_notifications
      .findAll(options);
  }

  async getPassKeyByAccount(number) {
    const options = {
      where: {
        number: number,
      },
      include: [{
        model: this.db.core.user,
        required: true,
      }],
      raw: true,
      nest: true,
    };
    return this.db.core
      .account
      .findOne(options);
  }

  async getPassKeyByDocument(cpf) {
    const options = {
      where: {
        cpf: cpf,
      },
      include: [{
        model: this.db.core.user,
        required: true,
      }],
      raw: true,
      nest: true,
    };
    return this.db.core
      .profile
      .findOne(options);
  }

  async getProfileByCPF(cpf) {
    const options = {
      where: {
        id: cpf,
      },
      raw: true,
      nest: true,
    };
    return this.db.core
      .profile
      .findOne(options);
  }

  async getCommunicationLargeScaleReport(type, term, status, pagination) {
    const options = {
      attributes: ['id', 'user_id', 'total_amount_to_process', 'total_amount_processed', 'created_at', 'scheduled_at', 'started_at', 'finished_at'],
      include: [{
          model: this.db.main.communication_large_scale_options,
          where: {
            communication_type: type,
            subject: {
              [this.db.Sequelize.Op.like]: '%' + term + '%'
            }
          },
          required: true,
        },
        {
          attributes: ['title'],
          model: this.db.main.communication_large_scale_status,
          required: true,
        }
      ],
      offset: pagination.offset,
      limit: pagination.limit,
      raw: true,
      nest: true,
      order: [
        ['created_at', pagination.order]
      ],
    };

    if (status) {
      options['where'] = {
        communication_large_scale_status_id: status
      };
    }

    return this.db.main
      .communication_large_scale
      .findAll(options);
  }

  async updateCommunicationLargeScaleStatus(id, new_status) {
    const options = {
      where: {
        id: id,
      }
    };
    const update = {
      communication_large_scale_status_id: new_status,
    };
    return this.db.main
      .communication_large_scale
      .update(update, options);
  }

  async getCommunicationLargeScaleStatus() {
    const options = {
      raw: true,
      order: [
        ['id', 'ASC']
      ],
    };
    return this.db.main
      .communication_large_scale_status
      .findAll(options);
  }

  async getCommunicationLargeScale(id) {
    const options = {
      where: {
        id: id,
      },
      raw: true,
      order: [
        ['id', 'ASC']
      ],
    };
    return this.db.main
      .communication_large_scale
      .findOne(options);
  }

  async getAccountsNumber(from) {
    return this.db.core
      .account
      .findAll({
        attributes: ['number'],
        where: {
          number: from
        }
      });
  }

  async getProfiles(from) {
    return this.db.core
      .profile
      .findAll({
        attributes: ['id'],
        where: {
          id: from
        }
      });
  }

}
module.exports = CommunicationLargeScaleRepository;
