'use strict';

class MachineAlertsRepository {
  constructor(params) {
    this.db = params.sequelize;
  }

  async getAlerts(paramsQuery) {
    const options = {
      where: paramsQuery.filters,
      order: paramsQuery.sorting,
      attributes: [
        'id',
        ['account_number', 'acc_number'],
        'status',
        'reason',
        [this.db.Sequelize.literal(this._getCountAlertSql()), 'quantity_alerts'],
        'created_at',
        'updated_at'
      ],
      include: [{
        model: this.db.inteligencia_operacoes.type_alert_pos,
        attributes: ['description_alert'],
        required: true,
        where: {
          status: 'active'
        }
      }],
      offset: paramsQuery.parameters.offset,
      limit: paramsQuery.parameters.limit,
      nest: true,
      raw: true
    };

    return this.db.inteligencia_operacoes
      .pos_alert
      .findAndCountAll(options);
  }

  async getAlert(id) {
    let options = {
      attributes: [
        'id',
        ['account_number', 'acc_number'],
        'status',
        'reason',
        [this.db.Sequelize.literal(this._getCountAlertSql()), 'quantity_alerts'],
        'created_at',
        'updated_at'
      ],
      include: [{
        model: this.db.inteligencia_operacoes.type_alert_pos,
        attributes: ['description_alert'],
        required: true,
        where: {
          status: 'active'
        }
      }],
      where: { id },
      nest: true,
      raw: true
    };

    return this.db.inteligencia_operacoes
      .pos_alert
      .findOne(options);
  }

  _getCountAlertSql() {
    return `(SELECT COUNT(id) FROM pos_alert
      WHERE account_number = acc_number and status <> 'ignored')`;
  }

  async updateAlert(id, payload) {
    let options = {
      where: {
        id: id
      }
    };

    return this.db.inteligencia_operacoes
      .pos_alert
      .update(payload, options);
  }

  async createAlertLog(payload) {
    return this.db.main
      .machine_alert_logs
      .create(payload);
  }

  async createStatusAlertHistory(payload) {
    return this.db.inteligencia_operacoes
      .status_pos_alert_history
      .create(payload);
  }

  async getAccNumberPosAlerts(alert_id) {
    let options = {
      where: {
        id: alert_id
      },
      attributes: [['account_number', 'number']],
      raw: true,
    };
    return this.db.inteligencia_operacoes
      .pos_alert
      .findOne(options);
  }

  async getAccountByNumber(account_number) {
    let optionsCore = {
      where: {
        number: account_number
      }
    };

    return this.db.core
      .account
      .findOne(optionsCore);
  }

  async getAccPasskey(account_id) {
    return this.db.core.user
      .findOne({
        attributes: ['passkey'],
        where: {
          account_id: account_id
        },
        raw: true
      });
  }

  async createNote(note, t) {
    return this.db.main
      .machine_alert_notes
      .create(note, {
        transaction: t
      });
  }

  async getNotes(account_id) {
    const options = {
      where: {
        account_id: account_id
      },
      attributes: ['id', 'content', 'user_id', 'created_at', 'updated_at']
    };

    return this.db.main
      .machine_alert_notes
      .findAll(options);
  }

  async getClientInfoAlert(account_number) {
    let options = {
      attributes: ['id', 'number', 'check_digit', 'primary_cnae'],
      where: {
        number: account_number
      },
      nest: true,
      include: [
        {
          model: this.db.core.document,
          attributes: ['id'],
          required: true,
          include: [{
            model: this.db.core.profile,
            attributes: ['id', 'cpf', 'email', 'name'],
            required: true
          }, {
            model: this.db.core.corporation,
            attributes: ['cnpj', 'name'],
            required: false
          }]
        }
      ]
    };

    return this.db.core
      .account
      .findOne(options);
  }

  async getDocumentBlocks(document_id) {
    return this.db.core
      .document_block
      .findAll({
        where: {
          document_id: document_id,
          type: ['charges', 'credits']
        },
        logging: true
      });
  }

  async createAlertTicket(payload) {
    return this.db.main
      .machine_alert_tickets
      .create(payload);
  }

  async getTicket(alert_id) {
    return this.db.main
      .machine_alert_tickets
      .findOne({
        where: {
          alert_id: alert_id
        }
      });
  }

  async getAlertIdByTicket(ticket_id) {
    return this.db.main
      .machine_alert_tickets
      .findOne({
        attributes: ['alert_id'],
        where: {
          ticket_id: ticket_id
        }
      });
  }

  async getTicketsByAccountId(account_id) {
    return this.db.main
      .machine_alert_tickets
      .findAll({
        where: {
          account_id: account_id
        }
      });
  }

  async getAlertQueue() {
    return this.db.intranet
      .user
      .findOne({
        where: {
          email: 'alertas_antifraude@gerencianet.com.br'
        }
      });
  }

  async getAnalysisQueue() {
    return this.db.intranet
      .user
      .findOne({
        where: {
          email: 'analise@gerencianet.com.br'
        }
      });
  }

  async getAlertMarkupActived(alert_id) {
    return this.db.main
      .machine_alert_markups
      .findOne({
        where: {
          alert_id: alert_id,
          status: true
        }
      });
  }

  async getAlertMarkups(alerts_id) {
    return this.db.main
      .machine_alert_markups
      .findAll({
        where: {
          alert_id: alerts_id,
          status: true
        }
      });
  }

  async createAlertMarkup(payload) {
    return this.db.main
      .machine_alert_markups
      .create(payload);
  }

  async updateAlertMarkup(id, payload) {
    return this.db.main
      .machine_alert_markups
      .update(payload, {
        where: {
          id: id
        }
      });
  }

  async getUser(id) {
    return this.db.intranet
      .user
      .findOne({
        where: {
          id: id
        }
      });
  }

}

module.exports = MachineAlertsRepository;
