class rateNegotiationsService {

  constructor(params) {
    this.config = params.config;
    this.isEmpty = require('lodash/isEmpty');
  }

  async getNegotiationRate(req) {
    let negotiationRate = {};

    negotiationRate.profile_id = req.profile_id;
    negotiationRate.account_id = req.account_id;
    negotiationRate.document = req.document;
    negotiationRate.name = req.name;
    negotiationRate.input_channel = req.input_channel;
    negotiationRate.input_channel_reference = req.input_channel_reference || null;
    negotiationRate.rate_negotiation_status_id = req.rate_negotiation_status_id || 1;
    negotiationRate.rate_negotiation_reasons_id = req.rate_negotiation_reasons_id;
    negotiationRate.responsible_user_id = req.responsible_user_id;
    negotiationRate.user_id = req.user_id;
    negotiationRate.observation = req.observation;

    return negotiationRate;
  }

  async getNegotiationBillets(req, rate_negotiations_id) {
    let negotiationRateBillet = {};
    negotiationRateBillet.rate_negotiations_id = rate_negotiations_id;
    negotiationRateBillet.requested_rate = req.requested_rate;
    negotiationRateBillet.expected_receipts = req.expected_receipts;
    negotiationRateBillet.availability_time = req.availability_time;
    negotiationRateBillet.rate_negotiation_config_status_id = req.rate_negotiation_config_status_id || 3;
    negotiationRateBillet.approvation_reason = req.approvation_reason || null;
    negotiationRateBillet.approver_user_id = req.approver_user_id || null;

    return negotiationRateBillet;
  }

  async getUpdatedNegotiationBillets(req) {
    let negotiationRateBillet = {};

    if (req.requested_rate) negotiationRateBillet.requested_rate = req.requested_rate;
    if (req.expected_receipts) negotiationRateBillet.expected_receipts = req.expected_receipts;
    if (req.availability_time) negotiationRateBillet.availability_time = req.availability_time;
    if (req.rate_negotiation_config_status_id) negotiationRateBillet.rate_negotiation_config_status_id = req.rate_negotiation_config_status_id;
    if (req.approvation_reason) negotiationRateBillet.approvation_reason = req.approvation_reason;
    if (req.approver_user_id) negotiationRateBillet.approver_user_id = req.approver_user_id;

    return negotiationRateBillet;
  }

  async getNegotiationCards(req, rate_negotiations_id) {
    let negotiationRateCard = {};

    negotiationRateCard.rate_negotiations_id = rate_negotiations_id;
    negotiationRateCard.requested_rate = req.requested_rate;
    negotiationRateCard.expected_receipts = req.expected_receipts;
    negotiationRateCard.rate_fixed = req.rate_fixed || null;
    negotiationRateCard.payment_type = req.payment_type;
    negotiationRateCard.availability_time = req.availability_time;
    negotiationRateCard.interest_type = req.interest_type;
    negotiationRateCard.interest_rate = req.interest_rate || null;
    negotiationRateCard.rate_negotiation_config_status_id = req.rate_negotiation_config_status_id || 3;
    negotiationRateCard.max_shares = req.max_shares || null;
    negotiationRateCard.max_without_interest = req.max_without_interest || null;
    negotiationRateCard.min_value = req.min_value || null;
    negotiationRateCard.approver_user_id = req.approver_user_id || null;
    negotiationRateCard.approvation_reason = req.approvation_reason || null;

    return negotiationRateCard;
  }

  async getUpdatedNegotiationCards(req) {
    let negotiationRateCard = {};

    if (req.requested_rate) negotiationRateCard.requested_rate = req.requested_rate;
    if (req.expected_receipts) negotiationRateCard.expected_receipts = req.expected_receipts;
    if (req.rate_fixed) negotiationRateCard.rate_fixed = req.rate_fixed;
    if (req.payment_type) negotiationRateCard.payment_type = req.payment_type;
    if (req.availability_time) negotiationRateCard.availability_time = req.availability_time;
    if (req.interest_type) negotiationRateCard.interest_type = req.interest_type;
    if (req.interest_rate) negotiationRateCard.interest_rate = req.interest_rate;
    if (req.rate_negotiation_config_status_id) negotiationRateCard.rate_negotiation_config_status_id = req.rate_negotiation_config_status_id;
    if (req.max_shares) negotiationRateCard.max_shares = req.max_shares;
    if (req.max_without_interest) negotiationRateCard.max_without_interest = req.max_without_interest;
    if (req.min_value) negotiationRateCard.min_value = req.min_value;
    if (req.approver_user_id) negotiationRateCard.approver_user_id = req.approver_user_id;
    if (req.approvation_reason) negotiationRateCard.approvation_reason = req.approvation_reason;

    return negotiationRateCard;
  }

  async getUpdatedNegotiationPix(req) {
    let negotiationRatePix = {};
    let tempObj = {};

    if (req.rate_negotiation_config_status_id) negotiationRatePix.rate_negotiation_config_status_id = req.rate_negotiation_config_status_id;
    if (req.approver_user_id) negotiationRatePix.approver_user_id = req.approver_user_id;
    if (req.approvation_reason) negotiationRatePix.approvation_reason = req.approvation_reason;
    if (req.default) tempObj.default = req.default;
    if (req.promocoes) tempObj.promocoes = req.promocoes;
    tempObj.type = req.type;

    negotiationRatePix.rate = tempObj;


    return negotiationRatePix;
  }

  async getRatesNegotiationPix(req, rate_negotiations_id) {
    let negotiationRatePix = {};
    negotiationRatePix.rate_negotiations_id = rate_negotiations_id;
    negotiationRatePix.rate = req;
    negotiationRatePix.rate_negotiation_config_status_id = req.rate_negotiation_config_status_id || 3;
    negotiationRatePix.approver_user_id = req.approver_user_id || null;
    negotiationRatePix.approvation_reason = req.approvation_reason || null;

    return negotiationRatePix;
  }


  async getNegotiationBankings(req, rate_negotiations_id) {
    let negotiationRateBankings = [];

    for (let negotiationRateBanking of req) {
      let negotiation = {};
      negotiation.rate_negotiations_id = rate_negotiations_id;
      negotiation.requested_rate = negotiationRateBanking.requested_rate;
      negotiation.rate_negotiation_types_id = negotiationRateBanking.rate_negotiation_types_id;
      negotiation.rate_negotiation_config_status_id = req.rate_negotiation_config_status_id || 3;
      negotiation.availability_time = negotiationRateBanking.availability_time;
      negotiation.approver_user_id = negotiationRateBanking.approver_user_id || null;
      negotiation.approvation_reason = negotiationRateBanking.approvation_reason || null;
      negotiationRateBankings.push(negotiation);
    }

    return negotiationRateBankings;
  }

  async getUpdatedNegotiationBankings(req) {
    let negotiationRateBanking = {};

    if (req.requested_rate) negotiationRateBanking.requested_rate = req.requested_rate;
    if (req.rate_negotiation_config_status_id) negotiationRateBanking.rate_negotiation_config_status_id = req.rate_negotiation_config_status_id;
    if (req.availability_time) negotiationRateBanking.availability_time = req.availability_time;
    if (req.approver_user_id) negotiationRateBanking.approver_user_id = req.approver_user_id;
    if (req.approvation_reason) negotiationRateBanking.approvation_reason = req.approvation_reason;

    return negotiationRateBanking;
  }

  async getDataAlter(negotiation, updatedNegotiation) {
    let old_values = {};
    Object.keys(updatedNegotiation).forEach(key => {
      old_values[key] = negotiation[key];
    });
    let data_alter = {
      old_values: old_values,
      new_values: updatedNegotiation
    };

    return data_alter;
  }

  async checkPixPermission(negotiationPix, analyst_rates) {

    let notHasPermission = [];

    negotiationPix.default.forEach(l => {
      if (l.tarifa.tipo == 'porcentagem') {
        notHasPermission.push(this.checkAnalystRate(l.tarifa.valor, analyst_rates.rate_pix));
        notHasPermission.push(this.checkAnalystRate(l.tarifa.tetoEmReais, analyst_rates.roof_pix));
      } else {
        notHasPermission.push(this.checkAnalystRate(l.tarifa.valor, analyst_rates.rate_fixed_pix));
      }
    });

    if (negotiationPix.type == 'promotions') {
      negotiationPix.promocoes.forEach(l => {
        l.beneficios.forEach(element => {
          if (element.tarifa.tipo == 'porcentagem') {
            notHasPermission.push(this.checkAnalystRate(element.tarifa.valor, analyst_rates.rate_pix));
            notHasPermission.push(this.checkAnalystRate(element.tarifa.tetoEmReais, analyst_rates.roof_pix));
          } else {
            notHasPermission.push(this.checkAnalystRate(element.tarifa.valor, analyst_rates.rate_fixed_pix));
          }
        });

      });
    }

    return notHasPermission.reduce((prev, curr) => {
      return prev || curr;
    });
  }

  checkAnalystRate(value, analyst_rate) {
    let check = false;
    check = value < analyst_rate ? true : false;
    return check;
  }

  async getDataAlterPix(negotiation, updatedNegotiation) {

    let arrTemp = [];
    let dataAlter = {
      basic: [],
      promotions: []
    };


    updatedNegotiation.default.forEach((basic, i) => {
      Object.keys(basic).forEach(values => {
        if (values == 'tarifa') {
          let optionalObj = this.checkOptionalObj(negotiation.default[i][values], basic[values]);

          if (optionalObj.negociation == 'actual') {
            delete optionalObj.negociation;
            Object.assign(basic[values], optionalObj);

          } else {
            delete optionalObj.negociation;
            Object.assign(negotiation.default[i][values], optionalObj);
          }
        }
        let tempCheck = this.checkObjDifferences(basic[values], negotiation.default[i][values]);
        if (!this.isEmpty(tempCheck))
          arrTemp.push(tempCheck);
      });

      if (arrTemp.length > 0)
        dataAlter.basic.push({
          [i]: arrTemp
        });
      arrTemp = [];
    });

    if (updatedNegotiation.promocoes) {
      updatedNegotiation.promocoes.forEach((promo, i) => {
        Object.keys(promo.condicao).forEach((cond) => {

          let tempCheck = this.checkObjDifferences(promo.condicao[cond], negotiation.promocoes[i].condicao[cond]);

          if (!this.isEmpty(tempCheck))
            arrTemp.push(tempCheck);

        });

        if (arrTemp.length > 0)
          dataAlter.promotions.push({
            [`condicao_${i}`]: arrTemp
          });
        arrTemp = [];

        promo.beneficios.forEach((benefi, index) => {
          Object.keys(benefi).forEach(key1 => {

            if (key1 == 'tarifa') {

              let optionalObj = this.checkOptionalObj(negotiation.promocoes[i].beneficios[index][key1], benefi[key1]);

              if (optionalObj.negociation == 'actual') {
                delete optionalObj.negociation;
                Object.assign(benefi[key1], optionalObj);

              } else {
                delete optionalObj.negociation;
                Object.assign(negotiation.promocoes[i].beneficios[index][key1], optionalObj);
              }
            }

            let tempCheck = this.checkObjDifferences(benefi[key1], negotiation.promocoes[i].beneficios[index][key1]);

            if (!this.isEmpty(tempCheck)) {
              tempCheck.old_values.faixa = index;
              tempCheck.new_values.faixa = index;
              arrTemp.push(tempCheck);
            }
          });
        });

        if (arrTemp.length > 0)
          dataAlter.promotions.push({
            [`beneficios_${i}`]: arrTemp
          });

        arrTemp = [];
      });
    }

    return dataAlter;
  }


  checkOptionalObj(newNegociation, actualNegociation) {
    let temp = {};
    if (!actualNegociation.tetoEmReais && newNegociation.tetoEmReais) {
      temp.tetoEmReais = null;
      temp.negociation = 'actual';
    }
    else if (actualNegociation.tetoEmReais && !newNegociation.tetoEmReais) {
      temp.tetoEmReais = null;
      temp.negociation = 'new';
    }

    return temp;
  }

  checkObjDifferences(newObj, actualObj) {
    let objTemp = {};

    Object.keys(newObj).forEach(element => {

      if (newObj[element] != actualObj[element]) {
        objTemp = {
          old_values: {
            [element]: actualObj[element],
          },
          new_values: {
            [element]: newObj[element],
          }
        };
      }
    });

    return objTemp;
  }

}

module.exports = rateNegotiationsService;
