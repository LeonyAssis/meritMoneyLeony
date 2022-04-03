'use strict';
class ControlClaimTypesRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async list() {
    const options = {     
      raw: true,      
    };

    return this.db.main
      .control_claim_types
      .findAll(options);
  }


}
module.exports = ControlClaimTypesRepository;
