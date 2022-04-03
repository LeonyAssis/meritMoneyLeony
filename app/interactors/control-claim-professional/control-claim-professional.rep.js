'use strict';
class ControlClaimProfessionalRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async createProfessional(body) {
    return this.db.main
      .control_claim_professionals
      .create(body);
  }

  async update(filter, data, t) {
    const options = {
      where: filter,
      transaction: t
    };
    return this.db.main
      .control_claim_professionals
      .update(data, options);

  }

  async get_by_id(id) {
    const options = {
      where: {
        id: id
      },
      raw: true
    };
    return this.db.main
      .control_claim_professionals
      .findOne(options);
  }

  async getFixedProfessionals() {
    const options = {
      where: {
        active: true
      },
      raw: true
    };
    return this.db.main
      .control_claim_fixed_professionals
      .findAll(options);
  }


  async list(control_claims_id) {
    const options = {
      where: {
        control_claims_id: control_claims_id
      },
      raw: true,
      attributes: ['id', 'control_claim_professional_types_id', 'status',
        'user_professional_id', 'name_professional', 'sector', 'created_at'
      ]
    };

    return this.db.main
      .control_claim_professionals
      .findAll(options);
  }


}
module.exports = ControlClaimProfessionalRepository;
