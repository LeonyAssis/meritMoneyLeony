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

  async getUsers() {
    return await this.db.main
      .users
      .findAll({ attributes: ['id', 'name', 'email', 'role_id', 'created_at', 'updated_at'], raw: true });
  }

  async getUser(id) {

    return await this.db.main
      .users
      .findOne({
        attributes: ['id', 'name', 'email', 'role_id', 'created_at', 'updated_at'],
        where: { id }
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