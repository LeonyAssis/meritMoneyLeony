'use strict';

class TransactionService {
  constructor(params) {
    this.config = params.config;
    this.db = params.sequelize;
  }
  async startTransaction() {
    return await this.db.main
      .sequelize
      .transaction();
  }

  async commitTransaction(t) {
    if (t) {
      await t.commit();
    }
  }

  async rollbackTransaction(t) {
    if (t) {
      await t.rollback();
    }
  }
}



module.exports = TransactionService;
