'use strict';

class ControlClaimCommentRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async create(comment) {
    return this.db.main
      .control_claim_comments
      .create(comment);
  }

  async listByClaim(id) {
    let options = {
      where: {
        control_claims_id: id
      }
    };

    return this.db.main
      .control_claim_comments
      .findAll(options);
  }

  async getClaim(id) {
    return this.db.main
      .control_claims
      .findByPk(id);
  }

}

module.exports = ControlClaimCommentRepository;
