'use strict';

class BenefitsBs {
  constructor(params) {
    this.gnLogger = params.gnLogger;
    this.validator = params.validatorService;
    this.errorService = params.errorService;
    this.benefitsRepository = params.benefitsRepository;
    this.benefitsService = params.benefitsService;
    this.balanceRepository = params.balanceRepository;
    this.transactionService = params.transactionService;
    this.balanceHistoryRepository = params.balanceHistoryRepository;
  }

  async getBenefits(req) {
    const { parameters, filters, sorting } = await this.benefitsService
      .mountOpts(req.query);

    const benefits = await this.benefitsRepository
      .getBenefits(parameters, filters, sorting);

    return benefits;
  }

  async getBenefit(req) {
    if (!req.params.id)
      throw this.errorService
        .get('id_required');

    const id = req.params.id;

    const benefit = await this.benefitsRepository
      .getBenefit({ id });

    if (!benefit)
      throw this.errorService
        .get('benefit_not_found');

    return benefit;
  }

  async upsertBenefits(req) {
    this.validator.execute('benefits.json', req.body);

    await this.benefitsRepository
      .upsertBenefits(req.body);
  }

  async updateBenefits(req) {
    this.validator.execute('benefits-update.json', req.body);

    const id = req.params.id;

    const benefit = await this.benefitsRepository
      .getBenefit({ id });

    if (!benefit)
      throw this.errorService
        .get('benefit_not_found');

    await this.benefitsRepository
      .updateBenefit(id, req.body);
  }

  async buyBenefits(req) {
    this.validator.execute('benefits-buy.json', req.body);

    const benefit = await this.benefitsRepository
      .getBenefit({ id: req.body.benefit_id });

    if (!benefit)
      throw this.errorService
        .get('benefit_not_found');

    const balance = await this.balanceRepository
      .getBalance(req.body.user_id);

    if (!balance)
      throw this.errorService
        .get('user_not_found');

    if (balance.balance < benefit.value)
      throw this.errorService
        .get('balance_is_lower_than_required');

    const t = await this.transactionService.startTransaction();    
    try {
      let newBalance = balance.balance - benefit.value;
      await this.balanceRepository.updateBalance(balance.id, newBalance, t);

      const history_balance = {
        user_origin: balance.user_id,
        benefits_id: benefit.id,
        value: benefit.value,
        type: 'BUY',
        responsible_id: req.body.user_id
        // responsible_id: balance.user_id
      };
      await this.balanceHistoryRepository.createBalanceHistory(history_balance, t);
      await this.transactionService.commitTransaction(t);
    }   
    catch (error) {
      await this.transactionService.rollbackTransaction(t);
      throw error;
    }   
  }
}

module.exports = BenefitsBs;