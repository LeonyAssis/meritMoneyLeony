'use strict';

class balanceHistoryRepository {
  constructor(params) {
    this.db = params.sequelize;
  }

  async createBalanceHistory(history_balance, t) {
    const options = {};
    
    if (t) {
      options.transaction = t;
    }

    return await this.db.main
      .balance_history
      .create(history_balance);
  }

  async getBalanceHistories(params, filters, sorting, filtersUserOrigin, filtersUserDestiny) {
    const options = {
      include: [{
        model: this.db.main.users,
        attributes: ['name'],
        where: filtersUserOrigin,
        required: true,
        as: 'userOrigin',
      },
      {
        model: this.db.main.users,
        attributes: ['name'],
        where: filtersUserDestiny,
        required: false,
        as: 'userDestiny',
      }],
      order: sorting, 
      offset: params.offset,
      limit: params.limit,
      where: filters,
      raw: true,
      nest: true,
      logging: true,
    };

    return await this.db.main
      .balance_history
      .findAndCountAll(options);
  }
}


module.exports = balanceHistoryRepository;