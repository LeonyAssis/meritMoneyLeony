'use strict';

const Interactor = require('../interactor.bs');

class UserBs extends Interactor {
  constructor(params) {
    super();
    this.validator = params.validatorService;
    this.errorService = params.errorService;
    this.userRepository = params.userRepository;
    this.balanceRepository = params.balanceRepository;
    this.transactionService = params.transactionService;
    this.userService = params.userService;
  }


  async createUser(req) {
    this.validator.execute('users.json', req.body);

    const t = await this.transactionService.startTransaction();

    try {
      const user = await this.userRepository
        .createUser(req.body);

      await this.balanceRepository
        .createBalance({ balance: 0, user_id: user.dataValues.id });

      await this.transactionService.commitTransaction(t);
      
    } catch (error) {
      await this.transactionService.rollbackTransaction(t);
      throw error;
    }

  }

  async getUsers(req) {
    let { parameters, filters, sorting } = await this.userService
      .getParametersList(req.query);

    const users = await this.userRepository
      .getUsers(parameters, filters, sorting);

    return users;
  }

  async getUser(req) {
    if (!(req.params.id || req.params.userId))
      throw this.errorService
        .get('id_required');

    const id = req.params.id || req.params.userId;
    const user = await this.userRepository
      .getUser({ id });

    if (!user)
      throw this.errorService
        .get('user_not_found');

    return user;
  }

  async updateUser(req) {
    this.validator.execute('user-edit.json', req.body);
    const id = req.params.userId;

    const user = await this.userRepository
      .getUser({ id });

    if (!user)
      throw this.errorService
        .get('user_not_found');


    await this.userRepository
      .updateUser(id, req.body);

    return user;
  }
}

module.exports = UserBs;