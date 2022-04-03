'use strict';
class CommercialWalletStatusTypesRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async list() {
    const options = {
      attributes: ['id', 'title', 'created_at', 'updated_at'],
      order: [
        ['title', 'asc']
      ],
      raw: true
    };

    return this.db.main
      .commercial_wallet_status_types
      .findAll(options);
  }
}

module.exports = CommercialWalletStatusTypesRepository;
