'use strict';

const Interactor = require('../interactor.bs');

class AccountNewRatesBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.moment = params.momentTz;
    this.validator = params.validatorService;
    this.accountNewRatesRepository = params.accountNewRatesRepository;
    this.formatService = params.formatService;
    this.accountNewRatesService = params.accountNewRatesService;
  }

  async get(req) {
    let account = req.params.account;

    let new_rate = await this.accountNewRatesRepository.get(account);

    if (!new_rate)
      throw this.errorService
        .get('no_account_rate_found');
    return new_rate;
  }

  async execute(req) {
    let limit = parseInt(req.query.limit) || 20;
    let balancing = parseInt(req.query.balancing) || 1;

    let accountRates = await this.accountNewRatesRepository
      .getAccountsToExecute(limit, balancing);

    if (accountRates.length <= 0)
      throw this.errorService
        .get('cannot_get_account_new_rate_to_edit');

    let ids = await this.formatService
      .formatObjectByProperty(accountRates, 'id');

    await this.accountNewRatesRepository
      .updateExecutedAt(ids);

    for (let accountRate of accountRates) {
      let input = {
        account: accountRate.account,
        new_rate: accountRate.new_rate
      };

      let resp = await this.accountNewRatesService.intranetAccountEditRate(accountRate);
      await this.accountNewRatesRepository.updateAnswer(accountRate.id, input, resp, resp.status);

    }

  }

}

module.exports = AccountNewRatesBs;
