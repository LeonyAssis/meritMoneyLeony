'use strict';

const Interactor = require('../interactor.bs');

class CommercialWalletStatusBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.commercialWalletStatusRepository = params.commercialWalletStatusRepository;
  }

  async create(req) {
    this.validator.execute('commercial-wallet-status.json', req);
    await this.commercialWalletStatusRepository
      .create(req);
  }

  async list(req) {
    let limit = parseInt(req.query.limit) || 10;
    let offset = ((parseInt(req.query.page_number) || 1) - 1) * limit;
    let order = req.query.order || 'desc';
    let pagination = {
      limit: limit,
      offset: offset,
      order: order
    };

    let status = await this.commercialWalletStatusRepository
      .list(req.params.commercial_wallet_id, pagination);

    if (status.length == 0)
      throw this.errorService
        .get('commercial_wallet_status_not_found');
    return status;

  }

  async list_by_document(req) {
    let limit = parseInt(req.query.limit) || 10;
    let offset = ((parseInt(req.query.page_number) || 1) - 1) * limit;
    let order = req.query.order || 'desc';

    let pagination = {
      limit: limit,
      offset: offset,
      order: order
    };

    let status = await this.commercialWalletStatusRepository
      .list_by_document(req.params.document, pagination);

    if (status.length == 0)
      throw this.errorService
        .get('commercial_wallet_status_not_found');

    return status;
  }
}

module.exports = CommercialWalletStatusBs;
