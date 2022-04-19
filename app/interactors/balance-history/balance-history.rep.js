'use strict';

class balanceHistoryRepository {
  constructor(params) {
    this.db = params.sequelize;
  }

  async createBalanceHistory(history_balance) {      

    return await this.db.main
      .balance_history
      .create(history_balance);
  }
}


module.exports = balanceHistoryRepository;