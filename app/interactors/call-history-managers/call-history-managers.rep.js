'use strict';
class callHistoryManagersRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async findByManager(id) {
    const options = {
      where: {
        manager_user_id: id
      },
      raw: true
    };

    return this.db.main
      .call_history_managers
      .findAndCountAll(options);
  }


}

module.exports = callHistoryManagersRepository;
