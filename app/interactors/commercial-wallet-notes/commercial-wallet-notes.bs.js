'use strict';

const Interactor = require('../interactor.bs');

class CommercialWalletNotesBs extends Interactor {


  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.commercialWalletNotesRepository = params.commercialWalletNotesRepository;
  }

  async create(req) {
    this.validator.execute('commercial-wallet-notes.json', req);
    await this.commercialWalletNotesRepository
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

    let notes = await this.commercialWalletNotesRepository
      .list(req.params.commercial_wallet_id, pagination);

    if (notes.length == 0)
      throw this.errorService
        .get('commercial_wallet_notes_not_found');

    return notes;
  }

  async list_by_document(req) {
    let limit = parseInt(req.query.limit) || 10;
    let offset = ((parseInt(req.query.page_number) || 1) - 1) * limit;
    let order = req.query.order || 'desc';
    let term = req.query.term || '';
    let type = req.query.type || 0;
    let important = req.query.important || null;

    let pagination = {
      limit: limit,
      offset: offset,
      order: order
    };

    let notes = await this.commercialWalletNotesRepository
      .list_by_document(req.params.document, pagination, term, type, important);

    if (notes.length == 0)
      throw this.errorService
        .get('commercial_wallet_notes_not_found');

    return notes;
  }
}

module.exports = CommercialWalletNotesBs;
