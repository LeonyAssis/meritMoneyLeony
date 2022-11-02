'use strict';

const Interactor = require('../interactor.bs');

class BalanceBs extends Interactor {

  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.validator = params.validatorService;
    this.errorService = params.errorService;
    this.userBs = params.userBs;
    this.balanceRepository = params.balanceRepository;
    this.balanceHistoryRepository = params.balanceHistoryRepository;
    this.balanceService = params.balanceService;
    this.transactionService = params.transactionService;
  }

  async getBalance(req) {
    req.params.id = req.params.userId;

    const user = await this.userBs
      .getUser(req);

    const balance = await this.balanceRepository
      .getBalance(user.id);

    return balance;
  }

  async transferMoney(req) {    
    this.validator.execute('transfer-balance.json', req.body);
    let balanceBody = req.body;

    let { balanceOwner, balanceReceiver } = await this.balanceService
      .checkUsersAndBalance(balanceBody.owner, balanceBody.sendTo, balanceBody.value);

    const t = await this.transactionService.startTransaction();
    try {
      let newBalanceOwner = balanceOwner.balance - balanceBody.value;
      let newBalanceSendTo = balanceReceiver.balance + balanceBody.value;

      await this.balanceRepository.updateBalance(balanceOwner.id, newBalanceOwner, t);
      await this.balanceRepository.updateBalance(balanceReceiver.id, newBalanceSendTo, t);

      const history_balance = {
        user_origin: balanceOwner.user_id,
        user_destiny: balanceReceiver.user_id,
        value: balanceBody.value,
        type: 'TRANSFER',
        responsible_id: balanceOwner.user_id
      };

      await this.balanceHistoryRepository.createBalanceHistory(history_balance);
      await this.transactionService.commitTransaction(t);

    } catch (error) {
      await this.transactionService.rollbackTransaction(t);
      throw error;
    }

    return 200;
  }


  async getBalanceHistories(req) {

    let { parameters, filters, sorting, filtersUserOrigin, filtersUserDestiny } = await this.balanceService
      .getParametersList(req.query);

    const balanceHistories = await this.balanceHistoryRepository
      .getBalanceHistories(parameters, filters, sorting, filtersUserOrigin, filtersUserDestiny);

    return balanceHistories;
  }

}
module.exports = BalanceBs;