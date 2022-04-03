'use strict';

const Interactor = require('../interactor.bs');

class CreditAnalysisHistoryBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.moment = params.momentTz;
    this.validator = params.validatorService;
    this.creditAnalysisHistoryRepository = params.creditAnalysisHistoryRepository;
    this.transactionService = params.transactionService;
  }

  async getRequests(req) {

    let requestId = req.params.request_id;
    let allRequests = await this.creditAnalysisHistoryRepository.getRequestId(requestId);

    if (allRequests.length == 0)
      throw this.errorService
        .get('request_id_not_found');

    return allRequests;
  }


  async getResponsible(req) {

    let name = req.body.name;
    let allRequests = await this.creditAnalysisHistoryRepository.getRequestByName(name);

    if (allRequests.length == 0)
      throw this.errorService
        .get('request_id_not_found');


    let ids = allRequests.map(request => parseInt(request.request_id));

    return ids;
  }

  async create(req) {
    this.validator.execute('credit-analysis-history.json', req);

    let t;
    try {
      t = await this.transactionService.startTransaction();
      await this.creditAnalysisHistoryRepository.createNewAnalysis(req);
      await this.transactionService.commitTransaction(t);
    } catch (e) {
      await this.transactionService.rollbackTransaction(t);
      console.log(e);
    }
  }


}

module.exports = CreditAnalysisHistoryBs;
