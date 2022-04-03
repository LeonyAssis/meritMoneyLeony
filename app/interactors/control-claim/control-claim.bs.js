'use strict';

const Interactor = require('../interactor.bs');

class ControlClaimBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.transactionService = params.transactionService;
    this.controlClaimRepository = params.controlClaimRepository;
    this.controlClaimProfessionalRepository = params.controlClaimProfessionalRepository;
    this.controlClaimService = params.controlClaimService;
  }

  async getCount() {
    let status = await this.controlClaimRepository
      .getCount();

    if (status.count == 0)
      throw this.errorService
        .get('control_claims_not_found');

    status.first_created_at = status.rows[0].created_at;
    delete status.rows;
    return status;
  }

  async create(req) {
    this.validator.execute('control-claim.json', req.body);

    if (req.body.professionals.length == 0)
      throw this.errorService
        .get('cannot_create_control_claims_professionals');

    let t;
    try {
      t = await this.transactionService.startTransaction();

      req.body.last_warning = new Date();

      let controlClaim = await this.controlClaimRepository
        .createControlClaim(req.body, t);

      let fixed_professionals = await this.controlClaimProfessionalRepository.getFixedProfessionals();

      if (fixed_professionals) {
        fixed_professionals = fixed_professionals.map((p) => {
          p.control_claim_professional_types_id = 5;
          delete p.id;
          delete p.active;
          delete p.created_at;
          delete p.updated_at;
          return p;
        });
        req.body.professionals = [...req.body.professionals, ...fixed_professionals];
      }

      let professionals = await this.controlClaimService.getProfessionals(req.body, controlClaim.id);

      await this.controlClaimRepository.createProfessionalClaim(professionals, t);

      if (req.body.comment) {
        let comment = await this.controlClaimService.getComment(req.body, controlClaim.id);

        await this.controlClaimRepository.createCommentClaim(comment, t);
      }

      await this.transactionService.commitTransaction(t);
    } catch (e) {

      await this.transactionService.rollbackTransaction(t);
      console.log(e);
    }

  }

  async list(req) {
    let parameters = await this.controlClaimService.getParametersList(req);

    let claims = await this.controlClaimRepository
      .list(parameters);

    if (claims.length == 0)
      throw this.errorService
        .get('control_claims_not_found');

    return claims;
  }

  async listById(id) {
    let claim = await this.controlClaimRepository
      .listById(id);

    if (!claim)
      throw this.errorService
        .get('control_claims_not_found');

    return claim;
  }

  async update(req) {
    this.validator.execute('control-claim-update.json', req.body);

    let claim = await this.controlClaimRepository
      .listById(req.params.id);

    if (!claim)
      throw this.errorService
        .get('control_claims_not_found');

    let body = req.body;

    if (body.finalized_at) {

      let bodyEnd = {};
      bodyEnd['finalized_at'] = new Date();

      await this.controlClaimRepository
        .updateControlClaim(req.params.id, bodyEnd);

    } else {

      let t;
      try {
        t = await this.transactionService.startTransaction();
        if (body.professionals) {
          let professionalsRequest = await this.controlClaimService.getProfessionals(body, req.params.id);
          let professionalsBd = await this.controlClaimProfessionalRepository.list(req.params.id);

          let professionalsUpdate = await this.controlClaimService.getProfessionalsUpdate(professionalsRequest, professionalsBd);
          let professionalsInsert = await this.controlClaimService.getProfessionalsInsert(professionalsRequest, professionalsBd);

          if (professionalsUpdate) {
            professionalsUpdate.forEach(async element => {
              await this.controlClaimProfessionalRepository.update({
                id: element.id
              }, element, t);
            });
          }

          if (professionalsInsert) {
            await this.controlClaimRepository.createProfessionalClaim(professionalsInsert, t);
          }
        }

        delete body['user_id'];

        await this.controlClaimRepository
          .updateControlClaim(req.params.id, body, t);

        await this.transactionService.commitTransaction(t);
      } catch (e) {

        await this.transactionService.rollbackTransaction(t);
        console.log(e);
      }

    }

  }

  async sendWarning(req) {
    let controlTime = req.query.time || 30;

    let activeClaims = await this.controlClaimRepository.getActiveClaims(controlTime);

    for (let claim of activeClaims) {
      let resp = await this.controlClaimService.sendWarning(claim.id);
      if (resp.status == '2')
        await this.controlClaimRepository
          .updateControlClaim(claim.id, {
            last_warning: new Date()
          });
    }
  }

}

module.exports = ControlClaimBs;
