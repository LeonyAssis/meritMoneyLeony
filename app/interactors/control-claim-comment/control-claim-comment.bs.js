'use strict';

const Interactor = require('../interactor.bs');

class ControlClaimCommentBs extends Interactor {

  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.controlClaimCommentRepository = params.controlClaimCommentRepository;
  }

  async create(req) {
    this.validator.execute('control-claim-comment.json', req.body);

    let comment = req.body;
    comment.control_claims_id = req.params.id;

    let claim = await this.controlClaimCommentRepository
      .getClaim(req.params.id);

    if (!claim)
      throw this.errorService
        .get('control_claims_not_found');

    await this.controlClaimCommentRepository
      .create(comment);
  }

  async listByClaim(id) {
    let comments = await this.controlClaimCommentRepository
      .listByClaim(id);

    if (comments.length == 0)
      throw this.errorService
        .get('control_claim_comments_not_found');

    return comments;
  }

}

module.exports = ControlClaimCommentBs;
