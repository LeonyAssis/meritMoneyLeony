'use strict';

const Interactor = require('../interactor.bs');

class rateNegotiationsBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.rateNegotiationsRepository = params.rateNegotiationsRepository;
    this.rateNegotiationsService = params.rateNegotiationsService;
  }

  async create(req) {
    this.validator.execute('negotiations-rate.json', req.body);

    let negotiationRate = null;
    negotiationRate = await this.rateNegotiationsService
      .getNegotiationRate(req.body);

    if (negotiationRate)
      var createdNegotiationRate = await this.rateNegotiationsRepository
        .createNegotiationRates(negotiationRate);
    else
      throw this.errorService
        .get('cannot_create_empty_negotiations');

    let negotiationRateBillets = null;
    if (req.body.rate_negotiation_billets) {
      negotiationRateBillets = await this.rateNegotiationsService
        .getNegotiationBillets(req.body.rate_negotiation_billets, createdNegotiationRate.id);
      let createdNegotiation = await this.rateNegotiationsRepository
        .createNegotiationRateBillets(negotiationRateBillets);

      let user_id = null;

      if (negotiationRateBillets.approver_user_id)
        user_id = negotiationRateBillets.approver_user_id;
      else
        user_id = negotiationRate.user_id;

      await this.rateNegotiationsRepository
        .createRateNegotiationHistory(createdNegotiation.id, 'billets', negotiationRateBillets.rate_negotiation_config_status_id, user_id, null);

    }
    let negotiationRateCards = null;
    if (req.body.rate_negotiation_cards) {
      negotiationRateCards = await this.rateNegotiationsService
        .getNegotiationCards(req.body.rate_negotiation_cards, createdNegotiationRate.id);
      let createdNegotiation = await this.rateNegotiationsRepository
        .createNegotiationRateCards(negotiationRateCards);

      let user_id = null;

      if (negotiationRateCards.approver_user_id)
        user_id = negotiationRateCards.approver_user_id;
      else
        user_id = negotiationRate.user_id;

      await this.rateNegotiationsRepository
        .createRateNegotiationHistory(createdNegotiation.id, 'cards', negotiationRateCards.rate_negotiation_config_status_id, user_id, null);
    }

    let negotiationRatePix = null;
    if (req.body.rate_negotiation_pix) {
      negotiationRatePix = await this.rateNegotiationsService
        .getRatesNegotiationPix(req.body.rate_negotiation_pix, createdNegotiationRate.id);

      let createdNegotiation = await this.rateNegotiationsRepository
        .createNegotiationPix(negotiationRatePix);

      let user_id = negotiationRate.user_id;

      await this.rateNegotiationsRepository
        .createRateNegotiationHistory(createdNegotiation.id, 'pix', negotiationRatePix.rate_negotiation_config_status_id, user_id, null);
    }

    let negotiationRateBankings = null;
    if (req.body.rate_negotiation_bankings)
      if (req.body.rate_negotiation_bankings.length > 0) {
        negotiationRateBankings = await this.rateNegotiationsService
          .getNegotiationBankings(req.body.rate_negotiation_bankings, createdNegotiationRate.id);
        for (let negotiation of negotiationRateBankings) {
          await this.rateNegotiationsRepository
            .createNegotiationBankings(negotiation);

          let user_id = null;

          if (negotiation.approver_user_id)
            user_id = negotiation.approver_user_id;
          else
            user_id = negotiationRate.user_id;

          await this.rateNegotiationsRepository
            .createRateNegotiationHistory(negotiation.id, 'bankings', negotiation.rate_negotiation_config_status_id, user_id, null);
        }
      }
  }

  async configuration_update(req) {
    this.validator.execute('negotiations-rate-update.json', req.body);

    let rateNegotiationId = null;
    let rateBody = req.body;

    if (rateBody.rate_negotiation_billets) {

      if (rateBody.rate_negotiation_billets.requested_rate < rateBody.analyst_rates.rate_billet)
        throw this.errorService
          .get('analyst_is_not_able_to_analyse_rate_due_his_level');

      let negotiationRateBillet = await this.rateNegotiationsRepository
        .getNegotiationsBillets(rateBody.rate_negotiation_billets.id);

      let updatedNegotiationRateBillets = await this.rateNegotiationsService
        .getUpdatedNegotiationBillets(rateBody.rate_negotiation_billets);

      if (negotiationRateBillet) {
        // Movido para dentro do IF
        rateNegotiationId = negotiationRateBillet.rate_negotiations_id;
        await this.rateNegotiationsRepository
          .updateNegotiationsBillets(negotiationRateBillet.id, updatedNegotiationRateBillets);

        if (updatedNegotiationRateBillets.rate_negotiation_config_status_id)
          await this.rateNegotiationsRepository
            .createRateNegotiationHistory(negotiationRateBillet.id, 'billets', updatedNegotiationRateBillets.rate_negotiation_config_status_id, updatedNegotiationRateBillets.approver_user_id, null, req.body.analyst_rates.rate_billet);
        else {
          let data_alter = await this.rateNegotiationsService
            .getDataAlter(negotiationRateBillet, updatedNegotiationRateBillets);
          await this.rateNegotiationsRepository
            .createRateNegotiationHistory(negotiationRateBillet.id, 'billets', negotiationRateBillet.rate_negotiation_config_status_id, req.body.user_id, data_alter, req.body.analyst_rates.rate_billet);
        }
      }
    }
    if (rateBody.rate_negotiation_cards) {

      if (rateBody.rate_negotiation_cards.requested_rate < rateBody.analyst_rates.rate_card)
        throw this.errorService
          .get('analyst_is_not_able_to_analyse_rate_due_his_level');

      let negotiationRateCard = await this.rateNegotiationsRepository
        .getNegotiationsCards(rateBody.rate_negotiation_cards.id);

      let updatedNegotiationRateCards = await this.rateNegotiationsService
        .getUpdatedNegotiationCards(rateBody.rate_negotiation_cards);

      if (negotiationRateCard) {
        // Movido para dentro do IF
        rateNegotiationId = negotiationRateCard.rate_negotiations_id;
        await this.rateNegotiationsRepository
          .updateNegotiationsCards(negotiationRateCard.id, updatedNegotiationRateCards);

        if (updatedNegotiationRateCards.rate_negotiation_config_status_id)
          await this.rateNegotiationsRepository
            .createRateNegotiationHistory(negotiationRateCard.id, 'cards', updatedNegotiationRateCards.rate_negotiation_config_status_id, updatedNegotiationRateCards.approver_user_id, null, req.body.analyst_rates.rate_card);
        else {
          let data_alter = await this.rateNegotiationsService
            .getDataAlter(negotiationRateCard, updatedNegotiationRateCards);
          await this.rateNegotiationsRepository
            .createRateNegotiationHistory(negotiationRateCard.id, 'cards', negotiationRateCard.rate_negotiation_config_status_id, req.body.user_id, data_alter, req.body.analyst_rates.rate_card);
        }
      }
    }

    if (rateBody.rate_negotiation_pix) {
      let pixReq = rateBody.rate_negotiation_pix;

      let check = await this.rateNegotiationsService
        .checkPixPermission(pixReq, rateBody.analyst_rates);

      if (check)
        throw this.errorService
          .get('analyst_is_not_able_to_analyse_rate_due_his_level');

      let negotiationRatePix = await this.rateNegotiationsRepository
        .getNegotiationsPix(pixReq.id);

      let updatedNegotiationRatePix = await this.rateNegotiationsService
        .getUpdatedNegotiationPix(pixReq);

      if (negotiationRatePix) {
        let analystRate = rateBody.analyst_rates;

        rateNegotiationId = negotiationRatePix.rate_negotiations_id;
        await this.rateNegotiationsRepository
          .updateNegotiationsPix(negotiationRatePix.id, updatedNegotiationRatePix);

        if (updatedNegotiationRatePix.rate_negotiation_config_status_id)
          await this.rateNegotiationsRepository
            .createRateNegotiationHistory(negotiationRatePix.id, 'pix', updatedNegotiationRatePix.rate_negotiation_config_status_id, updatedNegotiationRatePix.approver_user_id, null, analystRate);
        else {
          let data_alter = null;

          data_alter = await this.rateNegotiationsService
            .getDataAlterPix(negotiationRatePix.rate, updatedNegotiationRatePix.rate);

          await this.rateNegotiationsRepository
            .createRateNegotiationHistory(negotiationRatePix.id, 'pix', negotiationRatePix.rate_negotiation_config_status_id, rateBody.user_id, data_alter, analystRate);
        }
      }
    }
    if (rateBody.rate_negotiation_bankings) {
      let negotiationRateBankings = await this.rateNegotiationsRepository
        .getNegotiationsBankings(rateBody.rate_negotiation_bankings.id);

      let updatedNegotiationRateBankings = await this.rateNegotiationsService
        .getUpdatedNegotiationBankings(rateBody.rate_negotiation_bankings);

      if (negotiationRateBankings) {
        // Movido para dentro do IF
        rateNegotiationId = negotiationRateBankings.rate_negotiations_id;
        await this.rateNegotiationsRepository
          .updateNegotiationsBankings(negotiationRateBankings.id, updatedNegotiationRateBankings);

        if (updatedNegotiationRateBankings.rate_negotiation_config_status_id)
          await this.rateNegotiationsRepository
            .createRateNegotiationHistory(negotiationRateBankings.id, 'bankings', updatedNegotiationRateBankings.rate_negotiation_config_status_id, updatedNegotiationRateBankings.approver_user_id, null);
        else {
          let data_alter = await this.rateNegotiationsService
            .getDataAlter(negotiationRateBankings, updatedNegotiationRateBankings);
          await this.rateNegotiationsRepository
            .createRateNegotiationHistory(negotiationRateBankings.id, 'bankings', negotiationRateBankings.rate_negotiation_config_status_id, rateBody.user_id, data_alter);
        }
      }
    }

    if (rateNegotiationId) {
      let rateNegotiation = await this.rateNegotiationsRepository
        .getRateNegotiation(rateNegotiationId);
      if (rateNegotiation.rate_negotiation_status_id != 3) {
        let isComplete = await this.rateNegotiationsRepository
          .getAnyPendingNegotiation(rateNegotiationId);

        if (isComplete == 0) {
          await this.rateNegotiationsRepository.
            updateNegotiations(rateNegotiationId, 3);
          return 200;
        }
      }

    }
    return 201;
  }

  async assign_responsible(req) {
    this.validator.execute('negotiations-rate-assign.json', req.body);

    let limit = req.query.limit || 3;
    let responsible_user_id = req.body.responsible_user_id;
    let now = new Date();

    let userIdsComercialAnalysts = [];
    // await this.rateNegotiationsRepository
    //   .getCommercialAnalysts(responsible_user_id)
    //   .then(res => {
    //     res.forEach(doc => {
    //       userIdsComercialAnalysts.push(doc.user_id);
    //     });
    //     return userIdsComercialAnalysts;
    //   });

    let rateNegotiations = await this.rateNegotiationsRepository
      .getRateNegotiationsToAssign(limit, userIdsComercialAnalysts);

    if (rateNegotiations.length <= 0)
      throw this.errorService
        .get('none_rate_negotiation_to_assign');

    for (let negotiation of rateNegotiations) {
      await this.rateNegotiationsRepository
        .updateResponsabilities(negotiation.id, responsible_user_id, now);

      let billetNegotiation = await this.rateNegotiationsRepository
        .getRatesNegotiationBillets(negotiation.id, 3);

      if (billetNegotiation) {
        await this.rateNegotiationsRepository
          .updateNegotiationsBillets(billetNegotiation.id, {
            rate_negotiation_config_status_id: 4,
            approvation_reason: null,
            approver_user_id: null
          });

        await this.rateNegotiationsRepository
          .createRateNegotiationHistory(billetNegotiation.id, 'billets', 4, responsible_user_id, null);
      }

      let cardNegotiation = await this.rateNegotiationsRepository
        .getRatesNegotiationCards(negotiation.id, 3);

      if (cardNegotiation) {
        await this.rateNegotiationsRepository
          .updateNegotiationsCards(cardNegotiation.id, {
            rate_negotiation_config_status_id: 4,
            approvation_reason: null,
            approver_user_id: null
          });
        await this.rateNegotiationsRepository
          .createRateNegotiationHistory(cardNegotiation.id, 'cards', 4, responsible_user_id, null);
      }

      let pixNegociation = await this.rateNegotiationsRepository
        .getRatesNegotiationPix(negotiation.id, 3);

      if (pixNegociation) {
        await this.rateNegotiationsRepository
          .updateNegotiationsPix(pixNegociation.id, {
            rate_negotiation_config_status_id: 4,
            approvation_reason: null,
            approver_user_id: null
          });

        await this.rateNegotiationsRepository
          .createRateNegotiationHistory(pixNegociation.id, 'pix', 4, responsible_user_id, null);
      }

      let bankingsNegotiation = await this.rateNegotiationsRepository
        .getRatesNegotiationBankings(negotiation.id, 3);

      bankingsNegotiation.forEach(async bankingNegotiation => {
        await this.rateNegotiationsRepository
          .updateNegotiationsBankings(bankingNegotiation.id, {
            rate_negotiation_config_status_id: 4,
            approvation_reason: null,
            approver_user_id: null
          });
        await this.rateNegotiationsRepository
          .createRateNegotiationHistory(bankingNegotiation.id, 'bankings', 4, responsible_user_id, null);
      });
    }
  }

  async list(req) {
    let responsible_user_id = req.query.responsible_user_id;
    let status_type = req.query.status;
    let limit = parseInt(req.query.limit) || 15;
    let offset = ((parseInt(req.query.page_number) || 1) - 1) * limit;
    let order = req.query.order || 'ASC';
    let term = req.query.term || null;
    let status = null;

    if (!responsible_user_id)
      throw this.errorService
        .get('no_rate_negotiations_were_found');

    switch (status_type) {
      case 'approved':
        status = [1, 5];
        break;
      case 'reproved':
        status = [2, 6];
        break;
      case 'manual':
        status = [4];
        break;
      default:
        throw this.errorService
          .get('no_rate_negotiations_were_found');
    }

    let pagination = {
      limit: limit,
      offset: offset,
      order: order,
    };

    let rateNegotiations = await this.rateNegotiationsRepository
      .getRatesNegotiationFromConfigs(responsible_user_id, status, pagination, term, order.toUpperCase());

    if (rateNegotiations.length <= 0)
      throw this.errorService
        .get('no_rate_negotiations_were_found');

    for (let negotiation of rateNegotiations) {

      let total_negotiations = await this.rateNegotiationsRepository
        .countRateNegotiationsFromAccount(negotiation.account_id);
      negotiation.total_negotiations = total_negotiations.total;

      let billetNegotiation = await this.rateNegotiationsRepository
        .getRatesNegotiationBillets(negotiation.id, status);
      if (billetNegotiation)
        negotiation.rate_negotiation_billets = billetNegotiation;

      let cardNegotiation = await this.rateNegotiationsRepository
        .getRatesNegotiationCards(negotiation.id, status);
      if (cardNegotiation)
        negotiation.rate_negotiation_cards = cardNegotiation;

      let pixNegotiation = await this.rateNegotiationsRepository
        .getRatesNegotiationPix(negotiation.id, status);
      if (pixNegotiation)
        negotiation.rate_negotiation_pix = pixNegotiation;

      let bankingsNegotiation = await this.rateNegotiationsRepository
        .getRatesNegotiationBankings(negotiation.id, status);
      if (bankingsNegotiation.length > 0)
        negotiation.rate_negotiation_bankings = bankingsNegotiation;
    }

    let size = await this.rateNegotiationsRepository
      .countRatesNegotiationFromConfigs(responsible_user_id, status, term);

    rateNegotiations.push({
      size: size[0].total_rows
    });

    return rateNegotiations;
  }

  async history(req) {

    let limit = parseInt(req.query.limit) || 10;
    let offset = ((parseInt(req.query.page_number) || 1) - 1) * limit;
    let order = req.query.order || 'desc';
    let type = req.query.type;

    if (type != 'billets' && type != 'cards' && type != 'bankings' && type != 'pix')
      throw this.errorService
        .get('rate_negotiation_type_not_found');

    let pagination = {
      limit: limit,
      offset: offset,
      order: order
    };

    let histories = await this.rateNegotiationsRepository
      .historyList(req.params.id, type, pagination);

    if (histories.length == 0)
      throw this.errorService
        .get('no_history_rate_negotiations_were_found');

    return histories;

  }

  async has_negotiations_in_period(req) {
    let account_id = req.query.account_id;
    let months = req.query.months || 10;
    let negotiation = await this.rateNegotiationsRepository
      .getRateNegotiationsLast10Months(account_id, months);

    return negotiation.length;

  }

  async get_rate_negotiations_reasons() {

    let reasons = await this.rateNegotiationsRepository
      .reasonsList();

    return reasons;

  }

  async get(req) {

    let resp = await this.rateNegotiationsRepository
      .get(req.params.id);

    let bankingsNegotiation = await this.rateNegotiationsRepository
      .getRatesNegotiationBankings(req.params.id, null);
    if (bankingsNegotiation.length > 0)
      resp.rate_negotiation_bankings = bankingsNegotiation;

    if (!resp)
      throw this.errorService
        .get('no_rate_negotiations_were_found');

    return resp;

  }

  async get_counts() {

    let userIdsComercialAnalysts = [];

    let rateNegotiations = await this.rateNegotiationsRepository
      .getCountRateNegotiationsToAssign(userIdsComercialAnalysts);

    return rateNegotiations;
  }

  // async get_counts(req) {
  //   let responsible_user_id = req.body.responsible_user_id;
  //   let userIdsComercialAnalysts = [];
  //   await this.rateNegotiationsRepository
  //     .getCommercialAnalysts(responsible_user_id)
  //     .then(res => {
  //       res.forEach(doc => {
  //         userIdsComercialAnalysts.push(doc.user_id);
  //       });
  //       return userIdsComercialAnalysts;
  //     });

  //   let rateNegotiations = await this.rateNegotiationsRepository
  //     .getCountRateNegotiationsToAssign(userIdsComercialAnalysts);

  //   return rateNegotiations;
  // }

  async change_responsible(req) {

    let user_id = req.query.responsible_user_id;
    let rate_negotiation_id = req.params.id;

    if (!user_id || !user_id.match('^[0-9]+$'))
      throw this.errorService
        .get('responsible_user_id_required');

    let rate_negotiation = await this.rateNegotiationsRepository
      .get(rate_negotiation_id);

    if (!rate_negotiation)
      throw this.errorService
        .get('no_rate_negotiations_were_found');

    await this.rateNegotiationsRepository
      .updateResponsabilities(rate_negotiation.id, user_id, new Date());

    await this.rateNegotiationsRepository
      .createRateNegotiationLog(rate_negotiation.id, rate_negotiation.responsible_user_id, user_id);


    return 200;
  }
}

module.exports = rateNegotiationsBs;
