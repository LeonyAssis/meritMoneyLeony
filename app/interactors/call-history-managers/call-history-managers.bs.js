'use strict';

const Interactor = require('../interactor.bs');

class callHistoryManagersBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.transactionService = params.transactionService;
    this.callHistoryManagersRepository = params.callHistoryManagersRepository;
  }

  async list_by_manager(req) {

    let users = await this.callHistoryManagersRepository
      .findByManager(req.params.id);

    if (users.count == 0)
      throw this.errorService
        .get('no_users_to_manage');

    return users;
  }

}

module.exports = callHistoryManagersBs;
