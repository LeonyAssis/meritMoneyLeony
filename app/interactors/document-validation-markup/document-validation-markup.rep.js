'use strict';

class DocumentValidationMarkupRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async create(markup) {
    return this.db.main
      .document_validation_analyst_markups
      .create(markup);
  }

  async getLastMarkupFromValidationId(open_accounts_validation_id) {
    const options = {
      where: {
        open_accounts_validation_id: open_accounts_validation_id
      },
      order: [
        ['created_at', 'desc']
      ],
      raw: true,
      logging: true
    };

    return this.db.main
      .document_validation_analyst_markups
      .findOne(options);
  }
}

module.exports = DocumentValidationMarkupRepository;
