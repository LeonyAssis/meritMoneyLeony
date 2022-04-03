'use strict';

class AccountNewRatesRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async get(account) {
    let options = {
      where: {
        account: account
      },
      raw: true,
    };

    let result = this.db.main.account_new_rates.findOne(options);
    return result;
  }

  async getAccountsToExecute(limit, balancing) {
    const options = {
      where: {
        executed_at: null,
        balancing: balancing
      },
      limit: limit,
      order: [
        ['id', 'asc']
      ],
      raw: true
    };
    return this.db.main
      .account_new_rates
      .findAll(options);
  }

  async updateExecutedAt(ids) {
    const Op = this.db.Sequelize.Op;
    const options = {
      where: {
        id: {
          [Op.in]: ids
        }
      },
      logging: true
    };
    const update = {
      executed_at: new Date()
    };
    return this.db.main
      .account_new_rates
      .update(update, options);
  }

  async updateAnswer(id, input, output, code) {
    const options = {
      where: {
        id: id
      },
      logging: true
    };
    const update = {
      input: input,
      output: output,
      code: code
    };
    return this.db.main
      .account_new_rates
      .update(update, options);
  }
}

module.exports = AccountNewRatesRepository;
