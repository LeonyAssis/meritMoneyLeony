class MachineAlertsService {

  constructor(params) {
    this.config = params;
    this.errorService = params.errorService;
    this.db = params.sequelize;
    this.machineAlertsRepository = params.machineAlertsRepository;
    this.intranetService = params.intranetService;
  }

  async getParametersList(query) {
    const Op = this.db.Sequelize.Op;
    let limit = parseInt(query.limit) || 10;
    let offset = ((parseInt(query.page) || 1) - 1) * limit;
    let status = query.status;
    let column = query.column;
    let order = query.order;
    let search = query.search;
    let startDate = query.start_date;
    let endDate = query.end_date;
    let filters = {};

    let parameters = {
      limit: limit,
      offset: offset,
    };

    let sorting = [
      ['created_at', 'desc']
    ];

    if (['id', 'created_at'].includes(column)) {
      sorting = [
        [column, order == 'asc' ? 'asc' : 'desc'],
        ['created_at', 'desc']
      ];
    }

    if (['created','fraud','suspect','rejected','alert_fraud','alert_chargeback'].includes(status)) {
      filters['status'] = status;
    } else {
      filters['status'] = {
        [Op.not]: 'ignored'
      };
    }

    if (search && Number.isInteger(parseInt(search))) {
      filters['account_number'] = search;
    }

    if (startDate && endDate) {
      filters['created_at'] = {
        [Op.between]: [`${startDate} 00:00:00`, `${endDate} 23:59:59`]
      };
    } else if (startDate) {
      filters['created_at'] = {
        [Op.gte]: `${startDate} 00:00:00`
      };
    } else if (endDate) {
      filters['created_at'] = {
        [Op.lte]: `${endDate} 23:59:59`
      };
    }

    return { parameters, filters, sorting };
  }

  async getAlertAccount(alert_id) {
    let accNumber = await this.machineAlertsRepository
      .getAccNumberPosAlerts(alert_id);

    if (!accNumber)
      throw this.errorService
        .get('no_account_for_alert_were_found');

    return this.machineAlertsRepository
      .getAccountByNumber(accNumber.number);
  }

  async blockDocument(account, body, passkey) {
    let existingBlocksTypes = await this.machineAlertsRepository
      .getDocumentBlocks(account.document_id)
      .then(blocks => blocks.map(b => b.type));

    let blocks = ['charges', 'credits']
      .filter(b => !existingBlocksTypes.includes(b));

    if (blocks.length > 0) {
      const responseBlock = await this.intranetService
        .documentsBlocks({
          document_id: [account.document_id],
          blocks: blocks,
          note: body.reason,
          compliance_analyses_document: 'E',
          user_id: body.user_id
        });

      if (responseBlock.status == 2) {
        await this.createClientBlockTicket(passkey);
      }

      return responseBlock;
    }
  }

  async createClientBlockTicket(passkey) {
    const analysisQueue = await this.machineAlertsRepository
      .getAnalysisQueue();

    const templateData = {
      label: 'Gerencianet',
      title: 'Contato | Informações e Documentos | Setor de Análise',
      owner_id: analysisQueue.id,
      archive: 1
    };

    return this.intranetService
      .ticketCreate(passkey, 'document-block', templateData);
  }

  async createInternalAlertTicketCommunication(alert, account_id, passkey, templateData) {
    const alertTicket = await this.machineAlertsRepository
      .getTicket(alert.id);
    if (!alertTicket) {
      await this.createAnalysisAlertTicket(alert, account_id, passkey, templateData);
    } else {
      await this.createAnalysisAlertMessage(alertTicket.ticket_id, templateData);
    }
  }

  async createAnalysisAlertTicket(alert, account_id, passkey, templateData = {}) {
    const alertQueue = await this.machineAlertsRepository
      .getAlertQueue();

    templateData.label = 'Gerencianet';
    templateData.title = 'Alerta de bloqueio';
    templateData.owner_id = alertQueue.id;
    templateData.create_note = 1;

    const response = await this.intranetService
      .ticketCreate(passkey, 'alert-suspected-or-fraud', templateData);

    if (response.status == 2) {
      this.machineAlertsRepository
        .createAlertTicket({
          alert_id: alert.id,
          account_id: account_id,
          ticket_id: response.output.id
        });
    } else {
      throw this.errorService
        .get('create_ticket_machine_alert_error');
    }
  }

  async createAnalysisAlertMessage(ticket_id, templateData = {}) {
    const alertQueue = await this.machineAlertsRepository
      .getAlertQueue();

    templateData.author_id = alertQueue.id;
    templateData.create_note = 1;

    const response = await this.intranetService
      .messageTicketCreate(ticket_id, 'alert-suspected-or-fraud', templateData);

    if (response.status != 2) {
      throw this.errorService
        .get('create_ticket_mesage_machine_alert_error');
    }
}

  async getResponsible(data) {
    if (data.rows) {
      data.rows = await this._loadResponsibleInfo(data.rows);
    } else if (Array.isArray(data)) {
      data = await this._loadResponsibleInfo(data);
    } else {
      data = await this._loadResponsibleInfo([data]);
      data = data[0];
    }
    return data;
  }

  async _loadResponsibleInfo(data) {
    let alerts_id = data.map(d => d.id);

    const markups = await this.machineAlertsRepository
      .getAlertMarkups(alerts_id);

    return data.map(alert => {
      const markup = markups.find(m => m.alert_id == alert.id);
      alert.responsible = markup ? markup.user_id : null;
      return alert;
    });
  }

  async unmarkAlert(alert, payload) {
    const markupActived = await this.machineAlertsRepository
      .getAlertMarkupActived(alert.id);

    if (!markupActived) {
      throw this.errorService
        .get('alert_markup_does_not_exists');
    }

    payload.status = false;

    await this.machineAlertsRepository
      .updateAlertMarkup(markupActived.id, payload);
  }

  async markAlert(alert, payload) {
    const markupActived = await this.machineAlertsRepository
      .getAlertMarkupActived(alert.id);

    if (markupActived) {
      throw this.errorService
        .get('alert_markup_already_exists');
    }

    payload.alert_id = alert.id;

    await this.machineAlertsRepository
      .createAlertMarkup(payload);
  }

}

module.exports = MachineAlertsService;
