'use strict';

const Interactor = require('../interactor.bs');

class UserBs extends Interactor {
  constructor(params) {
    super();
    this.validator = params.validatorService;
    this.errorService = params.errorService;
    this.userRepository = params.userRepository;
  }


  async createUser(req) {
    this.validator.execute('users.json', req.body);

    const user = this.userRepository
      .createUser(req.body);

    return user;
  }

  async getUsers(req) {

    const users = await this.userRepository
      .getUsers(req.query);

    return users;
  }

  async getUser(req) {

    if (!req.params.id)
      throw this.errorService
        .get('id_required');

    const id = req.params.id;
    const user = await this.userRepository
      .getUser(id);

    if (!user)
      throw this.errorService
        .get('user_not_found');

    return user;
  }
}

module.exports = UserBs;