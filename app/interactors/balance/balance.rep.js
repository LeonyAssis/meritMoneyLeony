'use strict';

class balanceRepository {
  constructor(params) {
    this.db = params.sequelize;
  }

  async getBalance(userId) {
    const options = {
      where: {
        user_id: userId
      },
      raw: true
    };

    return await this.db.main
      .balance
      .findOne(options);
  }

  async createBalance(newBalance) {
    let balance = await this.db.main
      .balance
      .create(newBalance);

    return balance;
  }

  async getBalanceAndUser(user_id) {
    const options = {
      include: [{
        model: this.db.main.users,
        attributes: ['name',],
        where: { active: true },
        required: true
      }],
      logging: true,
      raw: true,
      nest: true,
      where: { user_id }
    };

    return await this.db.main
      .balance
      .findOne(options);
  }

  async getBalanceAndUsers() {
    const options = {
      include: [{
        model: this.db.main.users,
        where: { active: true },
        attributes: ['name'],
        required: true
      }],
      raw: true,
      logging: true,
      nest: true,
    };

    return await this.db.main
      .balance
      .findAll(options);
  }

  async updateBalance(id, balance, t) {
    const options = {
      where: { id }, 
      logging: true,   
    };

    if (t) {
      options.transaction = t;
    }
    
    return await this.db.main
      .balance
      .update({ balance }, options);
  }

  async updateUserBalance(user_id, balance) {
    const options = {
      where: { user_id }     
    };

    return await this.db.main
      .balance
      .update({ balance }, options);
  }

  // async createBalanceHistory(history_balance) {

  //   return await this.db.main
  //     .balance_history
  //     .create(history_balance);
  // }
}


module.exports = balanceRepository;