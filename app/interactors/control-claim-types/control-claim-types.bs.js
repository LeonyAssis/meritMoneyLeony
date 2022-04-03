'use strict';

const Interactor = require('../interactor.bs');

class ControlClaimProfessionalBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.transactionService = params.transactionService;
    this.controlClaimTypesRepository = params.controlClaimTypesRepository;    
    this.controlClaimTypesService = params.controlClaimTypesService;
  }
    
    async list() { 
    
      let controlClaimtypes = await this.controlClaimTypesRepository
        .list();
      
      await this.controlClaimTypesService.send_error_if_exists(controlClaimtypes,this.list);
  
      return controlClaimtypes;
    }

 
}

module.exports = ControlClaimProfessionalBs;
