class ShippingService {

  constructor(params) {
    this.config = params.config;
    this.validator = params.validatorService;
    this.constants = params.constants;
    this.correiosService = params.correiosService;
    this.correiosRequestService = params.correiosRequestService;
    this.errorService = params.errorService;
  }

  async getTimeAndCost(params, gis_log_id) {
    this.validator.execute('shipping_cost_time.json', params);

    let package_width = params.package_width;
    let package_height = params.package_height;
    let package_length = params.package_length;
    let package_weight = params.package_weight / 1000;
    let company = params.company.toUpperCase();
    let origin = params.origin;
    let destiny = params.destiny;
    let format = params.format.toUpperCase();
    let service = params.service;
    let self_hand = params.self_hand;
    let package_value = params.package_value / 100;
    let delivery_advicemment = params.delivery_advicemment;
    let post_card = params.post_card;

    if (company == 'CORREIOS') {
      if (package_value != 0 && !(package_value >= 21 && package_value <= 3000)) {
        throw this.errorService
          .get('shipping_package_value_invalid');
      }

      if (!post_card) {
        throw this.errorService
          .get('correios_post_card_is_required');
      }

      let nCdFormato = this.constants.CORREIOS.CALCPRECOPRAZO.FORMATOS[format];

      if (!nCdFormato)
        throw this.errorService
          .get('shipping_format_not_found');

      const sCdMaoPropria = self_hand ? 's' : 'n';
      const sCdAvisoRecebimento = delivery_advicemment ? 's' : 'n';

      var data = {
        sCepOrigem: origin,
        sCepDestino: destiny,
        nCdServico: service,
        nVlPeso: package_weight,
        nCdFormato: nCdFormato,
        nVlComprimento: package_length,
        nVlAltura: package_height,
        nVlLargura: package_width,
        nVlDiametro: 0,
        sCdMaoPropria: sCdMaoPropria,
        nVlValorDeclarado: package_value,
        sCdAvisoRecebimento: sCdAvisoRecebimento
      };

      return this.correiosService.getTimeAndCost(post_card, data, gis_log_id);
    }

    throw this.errorService
      .get('shipping_company_not_found');
  }

}

module.exports = ShippingService;
