class BenefitsRepository {
  constructor(params) {
    this.db = params.sequelize;
  };

  async getBenefits(params, filters, sorting) {
    const options = {
      raw: true,
      logging: true,
      where: filters,
      order: sorting,
      offset: params.offset,
      limit: params.limit,
    };

    return await this.db.main
      .benefits
      .findAndCountAll(options);
  }

  async getBenefit(filter) {
    return await this.db.main
      .benefits
      .findOne({
        where: filter,
        raw: true
      });
  }

  async upsertBenefits(newBenefit) {
    return await this.db.main
      .benefits
      .upsert(newBenefit, { logging: true });
  }

  async updateBenefit(id, benefit) {
    const options = {
      where: { id }
    };

    return await this.db.main
      .benefits
      .update(benefit, options);
  }
}

module.exports = BenefitsRepository;