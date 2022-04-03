'use strict';
class CommercialWalletNoteTypesRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async list() {
    const options = {
      attributes: ['id', 'name', 'created_at', 'updated_at'],
      order: [
        ['name', 'asc']
      ],
      raw: true
    };

    return this.db.main
      .commercial_wallet_note_types
      .findAll(options);
  }
}

module.exports = CommercialWalletNoteTypesRepository;
