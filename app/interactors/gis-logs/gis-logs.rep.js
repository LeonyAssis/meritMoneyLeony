'use strict';
class GisLogsRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async create(data) {
    return this.db.main
      .gis_logs
      .create(data);
  }

}

module.exports = GisLogsRepository;
