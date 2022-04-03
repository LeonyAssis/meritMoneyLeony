'use strict';
class CommercialWalletStatusRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async create(status) {
    return this.db.main
      .commercial_wallet_status
      .create(status);
  }

  async list(commercial_wallet_id, pagination) {
    const options = {
      where: {
        commercial_wallet_id: commercial_wallet_id
      },
      order: [
        ['updated_at', pagination.order]
      ],
      include: [{
        model: this.db.main.commercial_wallet_status_types,
        attributes: ['title'],
        required: true
      }],
      raw: false,
      offset: pagination.offset,
      limit: pagination.limit
    };

    return this.db.main
      .commercial_wallet_status
      .findAll(options);
  }

  async list_by_document(document, pagination) {
    const options = {
      include: [{
        model: this.db.main.commercial_wallets,
        atributes: ['id'],
        where: {
          document: document
        },
        required: true
      }, {
        model: this.db.main.commercial_wallet_status_types,
        attributes: ['id', 'title'],
        required: true
      }],
      order: [
        ['updated_at', pagination.order]
      ],
      raw: true,
      offset: pagination.offset,
      limit: pagination.limit,

    };

    return this.db.main
      .commercial_wallet_status
      .findAll(options);
  }
}

module.exports = CommercialWalletStatusRepository;
