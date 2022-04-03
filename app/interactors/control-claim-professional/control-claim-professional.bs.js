'use strict';

const Interactor = require('../interactor.bs');

class ControlClaimProfessionalBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.transactionService = params.transactionService;
    this.controlClaimProfessionalRepository = params.controlClaimProfessionalRepository;
  }

  async create(req) {
    this.validator.execute('control-claim-professional.json', req.body);
    let professional = req.body;
    professional.control_claims_id = req.params.id;

    await this.controlClaimProfessionalRepository.
      createProfessional(professional);
  }

  async update_professional(req) {
    this.validator.execute('control-claim-professional.json', req.body);
    let professional_id = req.params.id;

    let professional = await this.controlClaimProfessionalRepository
      .get_by_id(professional_id);

    await this.send_error_if_exists(professional, this.update_professional);

    professional = req.body;
    let t;
    try {
      t = await this.transactionService.startTransaction();

      await this.controlClaimProfessionalRepository.update({
        id: professional_id
      }, {
        control_claim_professional_types_id: professional.control_claim_professional_types_id,
        user_professional_id: professional.user_professional_id,
        name_professional: professional.name_professional,
        sector: professional.sector,
        user_id: professional.user_id
      }, t);


      await this.transactionService.commitTransaction(t);
    } catch (e) {

      await this.transactionService.rollbackTransaction(t);
      console.log(e);
    }
  }

  async delete_professional(req) {
    let professional_id = req.params.id;

    let professional = await this.controlClaimProfessionalRepository
      .get_by_id(professional_id);

    await this.send_error_if_exists(professional, this.delete_professional);

    let t;
    try {
      t = await this.transactionService.startTransaction();

      await this.controlClaimProfessionalRepository.update({
        id: professional_id
      }, {
        status: 0
      }, t);

      await this.transactionService.commitTransaction(t);
    } catch (e) {

      await this.transactionService.rollbackTransaction(t);
      console.log(e);
    }
  }

  async list(req) {

    let professional = await this.controlClaimProfessionalRepository
      .list(req.params.id);

    await this.send_error_if_exists(professional, this.list);

    return professional;
  }

  async send_error_if_exists(value, f) {
    if (!value || value.length == 0) {
      switch (f.name) {
        case 'delete_professional':
          throw this.errorService.get('delete_professional_by_id_not_found');

        case 'update_professional':
          throw this.errorService.get('update_professional_by_id_not_found');

        case 'list':
          throw this.errorService.get('get_professionals_by_control_claim_not_found');

      }
    }
  }
}

module.exports = ControlClaimProfessionalBs;
