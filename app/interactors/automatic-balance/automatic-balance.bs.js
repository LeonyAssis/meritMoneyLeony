'use strict';
const Interactor = require('../interactor.bs');

class AutomaticBalanceBs extends Interactor {
  constructor(params) {
    super();
    this.validator = params.validatorService;
    this.automaticBalanceConfigRepository = params.automaticBalanceConfigRepository;
    this.userRepository = params.userRepository;
    this.balanceRepository = params.balanceRepository;
    this.balanceHistoryRepository = params.balanceHistoryRepository;
    this.automaticBalanceRepository = params.automaticBalanceRepository;
    this.transactionService = params.transactionService;
  }

  async getConfig() {
    const config = await this.automaticBalanceConfigRepository
      .getConfig();

    return config;
  }

  async updateConfig(req) {
    this.validator.execute('automatic-balance-config-edit.json', req.body);
    const config = await this.getConfig();  
    
    await this.automaticBalanceConfigRepository
      .updateConfig(config.id, req.body);
  }

  async getAutomaticBalanceExecutionStatus(firstDayOfMonth, lastDayOfMonth) {
    const execution = await this.automaticBalanceRepository
      .getAutomaticBalanceExecutionStatus(firstDayOfMonth, lastDayOfMonth);

    return execution;
  }

  async skipOrExecuteAutomaticBalance(config) {
    const executionStatus = await this.automaticBalanceConfigRepository
      .getExecutionStatus();

    let errorUser = [];

    if (!executionStatus) {
      const data = {
        value: config.value,
        status: 'EXECUTING',
      };

      const execution = await this.automaticBalanceConfigRepository
        .createExecution(data);  

      let balanceAndUsers = await this.balanceRepository
        .getBalanceAndUsers();

      let t;
      for (const user of balanceAndUsers) {
        try {
          t = await this.transactionService.startTransaction();

          await this.automaticBalanceConfigRepository
            .createExecutionUserHistory({ user_id: user.user_id, automatic_balance_id: execution.id });

          let newbalance = user.balance + execution.value;

          await this.balanceRepository
            .updateUserBalance(user.user_id, newbalance);

          await this.transactionService.commitTransaction(t);

        } catch (error) {
          errorUser.push({ user_id: user.user_id });
        }
      }

      const history_balance = {
        user_origin: 12,
        user_destiny: null,
        value: execution.value,
        type: 'MONTHLY_INCOME',
        responsible_id: 12
      };

      await this.balanceHistoryRepository
        .createBalanceHistory(history_balance);

      let updateExecution = {
        status: 'FINISHED',
      };

      updateExecution["error_users"] = errorUser.length > 0 ? errorUser : null;
      await this.automaticBalanceConfigRepository
        .updateExecution(execution.id, updateExecution);
    }

    return 200;
  }
}

module.exports = AutomaticBalanceBs;


