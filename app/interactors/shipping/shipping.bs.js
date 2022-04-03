'use strict';

const Interactor = require('../interactor.bs');

class ShippingBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.formatService = params.formatService;
    this.correiosService = params.correiosService;
    this.shippingService = params.shippingService;
  }

  async getTimeAndCosts(req) {
    return this.shippingService.getTimeAndCost(req.body, req.gis_log_id);
  }
}

module.exports = ShippingBs;
