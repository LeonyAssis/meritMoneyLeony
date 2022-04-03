'use strict';

const Interactor = require('../interactor.bs');

class CommercialWalletStatusTypesBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.commercialWalletStatusTypesRepository = params.commercialWalletStatusTypesRepository;
  }

  async list() {
    let status_types = await this.commercialWalletStatusTypesRepository
      .list();

    if (status_types.length == 0)
      throw this.errorService
        .get('commercial_wallet_status_types_not_found');

    return status_types;
  }
}

module.exports = CommercialWalletStatusTypesBs;
