'use strict';

const Interactor = require('../interactor.bs');

class CommercialWalletHistoryResponsiblesBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.commercialWalletHistoryResponsiblesRepository = params.commercialWalletHistoryResponsiblesRepository;
  }

}

module.exports = CommercialWalletHistoryResponsiblesBs;
