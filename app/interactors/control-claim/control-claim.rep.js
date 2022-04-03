'use strict';
class ControlClaimRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async getCount() {
    const options = {
      where: {
        finalized_at: null
      },
      order: [
        ['created_at', 'ASC']
      ]
    };

    return this.db.main
      .control_claims
      .findAndCountAll(options);
  }

  async createControlClaim(controlClaim) {
    return this.db.main
      .control_claims
      .create(controlClaim);
  }

  async createCommentClaim(comment) {
    return this.db.main
      .control_claim_comments
      .create(comment);
  }

  async createProfessionalClaim(professional) {
    return this.db.main
      .control_claim_professionals
      .bulkCreate(professional);
  }

  async list(params) {
    const Op = this.db.Sequelize.Op;

    const options = {
      where: {
        finalized_at: params.finalizedAt,
        [Op.or]: params.search,
        created_at: params.createdAt
      },
      order: [
        [params.column, params.order]
      ],
      offset: params.offset,
      limit: params.limit,
      logging: true
    };

    if (params.createdAt == null)
      delete options['where']['created_at'];

    return this.db.main
      .control_claims
      .findAndCountAll(options);
  }

  async listById(id) {

    const options = {
      where: {
        id: id
      },
      logging: true
    };

    return this.db.main
      .control_claims
      .findOne(options);
  }

  async updateControlClaim(id, data) {
    let options = {
      where: {
        id: id
      },
      raw: true
    };

    return this.db.main
      .control_claims
      .update(data, options);
  }

  async getActiveClaims(time) {
    const Op = this.db.Sequelize.Op;

    const options = {
      where: {
        [Op.and]: [{
            finalized_at: null
          },
          this.db.Sequelize.where(this.db.Sequelize.fn('timestampdiff', this.db.Sequelize.literal('MINUTE'), this.db.Sequelize.col('last_warning'), this.db.Sequelize.fn('CURRENT_TIMESTAMP')), '>', time)
        ]
      },
      raw: true,
      logging: true
    };

    return this.db.main
      .control_claims
      .findAll(options);
  }

}

module.exports = ControlClaimRepository;
