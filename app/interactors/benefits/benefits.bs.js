'use strict';

class BenefitsBs {
  constructor(params) {
    this.gnLogger = params.gnLogger;
    this.validator = params.validatorService;
    this.errorService = params.errorService;
    this.benefitsRepository = params.benefitsRepository;
    this.benefitsService = params.benefitsService;
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

    const id = req.params.id;

    const benefit = await this.benefitsRepository
      .getBenefit({ id });

    if (!benefit)
      throw this.errorService
        .get('benefit_not_found');

    await this.benefitsRepository
      .updateBenefit(id, req.body);
  }
}

module.exports = BenefitsBs;