'use strict';

class CreditAnalysisRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async getRequestId(requestId) {

    let options = {
      attributes: ['id', 'request_id', 'name', 'user_id', 'reason', 'status', 'created_at'],
      where: {
        request_id: requestId
      },
      raw: true,
    };

    let result = this.db.main.credit_analysis_history.findAll(options);
    return result;
  }

  async getRequestByName(name) {

    const Op = this.db.Sequelize.Op;

    let options = {
      attributes: [this.db.Sequelize.fn('DISTINCT', this.db.Sequelize.col('request_id'))],
      where: {
        name: {
          [Op.like]: `%${name}%`
        }
      },
      raw: true,
    };

    let result = this.db.main.credit_analysis_history.findAll(options);
    return result;
  }

  async createNewAnalysis(request) {
    return this.db.main
      .credit_analysis_history
      .create(request);
  }
}

module.exports = CreditAnalysisRepository;
