'use strict';

const Interactor = require('../interactor.bs');

class DocumentValidationMarkupBs extends Interactor {


  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.documentValidationMarkupRepository = params.documentValidationMarkupRepository;
  }

  async create(req) {
    this.validator.execute('document-validation-analyst-markup.json', req);

    let lastMarkup = await this.documentValidationMarkupRepository
      .getLastMarkupFromValidationId(req.open_accounts_validation_id);

    if (!lastMarkup)
      req.status = 1;
    else if (lastMarkup.status == 1)
      req.status = 0;
    else
      req.status = 1;

    let createdMarkup = await this.documentValidationMarkupRepository
      .create(req);
    return createdMarkup;
  }

  async getLastMarkup(req) {
    this.validator.execute('document-validation-analyst-markup.json', req);

    let lastMarkup = await this.documentValidationMarkupRepository
      .getLastMarkupFromValidationId(req.open_accounts_validation_id);

    if (!lastMarkup)
      throw this.errorService
        .get('cannot_find_markup_to_open_accounts_validation');

    return lastMarkup;
  }
}

module.exports = DocumentValidationMarkupBs;
