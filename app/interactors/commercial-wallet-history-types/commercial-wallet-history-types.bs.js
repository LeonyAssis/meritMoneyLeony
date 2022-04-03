'use strict';

const Interactor = require('../interactor.bs');

class CommercialWalletHistoryTypesBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.commercialWalletHistoryTypesRepository = params.commercialWalletHistoryTypesRepository;
  }

}

module.exports = CommercialWalletHistoryTypesBs;
