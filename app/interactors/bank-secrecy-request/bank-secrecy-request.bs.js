'use strict';

const Interactor = require('../interactor.bs');

class BankSecrecyRequestBs extends Interactor {


  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.bankSecrecyRequestRepository = params.bankSecrecyRequestRepository;
    this.bankSecrecyRequestService = params.bankSecrecyRequestService;
  }

  async create(req) {
    this.validator.execute('bank-secrecy-request.json', req);

    let resp = await this.bankSecrecyRequestService
      .createStatmentRequest(Object.assign({}, req));

    if (!resp || !resp.statement_request_id)
      throw this.errorService
        .get('cant_communicate_with_ccs');

    await this.bankSecrecyRequestRepository
      .create(req, resp.statement_request_id);
  }

  async update(req) {
    this.validator.execute('bank-secrecy-request-update.json', req);

    let bank_secrecy_request = await this.bankSecrecyRequestRepository
      .get(req.params.id);

    if (!bank_secrecy_request)
      throw this.errorService
        .get('no_availiable_bank_secrecy_requests');

    let body = {
      statement_request_id: bank_secrecy_request.statement_request_id,
      receipt_number: req.body.receipt_number,
      receipt_date: req.body.receipt_date
    };

    let resp = await this.bankSecrecyRequestService
      .shipping_receipt(body);

    if (resp != 200)
      throw this.errorService
        .get('cant_communicate_with_ccs');

    await this.bankSecrecyRequestRepository
      .update(req.body, req.params.id);

  }

  async list(req) {
    let limit = parseInt(req.query.limit) || 20;
    let offset = ((parseInt(req.query.page_number) || 1) - 1) * limit;
    let order = req.query.order || 'desc';

    let pagination = {
      limit: limit,
      offset: offset,
      order: order
    };

    let term = req.query.term;

    let data = await this.bankSecrecyRequestRepository
      .list(term, pagination);

    if (data.length == 0)
      throw this.errorService
        .get('no_availiable_bank_secrecy_requests');

    let size = await this.bankSecrecyRequestRepository
      .count(term);

    let result = {
      data: data,
      size: size
    };

    return result;
  }
}

module.exports = BankSecrecyRequestBs;
