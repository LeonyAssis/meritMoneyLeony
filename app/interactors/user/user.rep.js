'use strict';

class userRepository {
  constructor(params) {
    this.db = params.sequelize;
  }

  async createUser(user) {
    return await this.db.main
      .users
      .create(user, { raw: true });
  }

  async getUsers(params, filters, sorting) {
    const options = {
      where: filters,
      order: sorting,
      attributes: ['id', 'name', 'email', 'role_id', 'created_at', 'updated_at'],
      offset: params.offset,
      limit: params.limit,
      nest: true,
    };

    return await this.db.main
      .users
      .findAndCountAll(options);
  }

  async getUser(filter) {

    return await this.db.main
      .users
      .findOne({
        attributes: ['id', 'name', 'email', 'role_id', 'created_at', 'updated_at'],
        where: filter,
        raw: true,

      });
  }

  async getUserAndPassword(filter) {
    return await this.db.main
      .users
      .findOne({
        attributes: ['id', 'name', 'email', 'password'],
        where: filter,
        raw: true
      });
  }

  async updateUser(id, user) {
    const options = {
      where: { id }
    };

    return await this.db.main
      .users
      .update(user, options);
  }

}

module.exports = userRepository;