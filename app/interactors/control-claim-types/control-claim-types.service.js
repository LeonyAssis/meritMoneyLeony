class ControlClaimTypesService {

    constructor(params) {
      this.config = params;
      this.db = params.sequelize;
      this.moment = params.moment;
      this.errorService = params.errorService;
    }
  
    async send_error_if_exists(value, f){
        if(!value || value.length == 0){
          switch (f.name) {         
            case 'list':
                  throw this.errorService.get('control_claim_types_not_found');  
            default:
              break;
          }
        }
      }
  
  }
  
  module.exports = ControlClaimTypesService;
  