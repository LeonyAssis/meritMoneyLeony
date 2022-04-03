'use strict';

const Interactor = require('../interactor.bs');

class CommercialWalletNoteTypesBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.commercialWalletNoteTypesRepository = params.commercialWalletNoteTypesRepository;
  }

  async list() {
    let note_types = await this.commercialWalletNoteTypesRepository
      .list();

    if (note_types.length == 0)
      throw this.errorService
        .get('commercial_wallet_note_types_not_found');

    return note_types;
  }
}

module.exports = CommercialWalletNoteTypesBs;
