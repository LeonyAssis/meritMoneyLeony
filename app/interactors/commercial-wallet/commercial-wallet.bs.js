'use strict';

const Interactor = require('../interactor.bs');

class CommercialWalletBs extends Interactor {

  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.commercialWalletRepository = params.commercialWalletRepository;
    this.db = params.sequelize;
    this.transactionService = params.transactionService;
    this.commercialWalletHistoryTypesRepository = params.commercialWalletHistoryTypesRepository;
    this.commercialWalletHistoryResponsiblesRepository = params.commercialWalletHistoryResponsiblesRepository;
    this.commercialWalletHistoryAnalysesRepository = params.commercialWalletHistoryAnalysesRepository;
    this.commercialWalletHistorySizesRepository = params.commercialWalletHistorySizesRepository;

  }

  async get(req) {
    let commercialWallet = await this.commercialWalletRepository
      .get(req.params.document);

    if (commercialWallet.length == 0)
      throw this.errorService
        .get('commercial_wallet_by_document_not_found');
    return commercialWallet;
  }

  async create(req) {
    this.validator.execute('commercial-wallet.json', req);

    if (req.commercial_size != undefined)
      await this.commercialWalletRepository.documentCommercialSizeIntranet(req.document_id, req.commercial_size);

    return await this.commercialWalletRepository.create(req);
  }

  async update_type(req) {
    this.validator.execute('commercial-wallet-update-type.json', req.body);
    let commercial_wallet_id = req.params.id;

    let commercialWallet = await this.commercialWalletRepository
      .get_by_id(commercial_wallet_id);

    if (!commercialWallet)
      throw this.errorService
        .get('commercial_wallet_by_document_not_found');

    let type_old = commercialWallet.type;
    let type_new = req.body.type;
    if (type_old == type_new)
      throw this.errorService
        .get('commercial_wallet_param_update_is_the_same');

    let t;
    try {
      t = await this.transactionService.startTransaction();

      await this.commercialWalletRepository.update({
        id: commercial_wallet_id
      }, {
        type: type_new,
        revaluation: req.body.revaluation
      }, t);

      await this.commercialWalletHistoryTypesRepository
        .create(commercial_wallet_id, type_old, type_new, req.body.user_id, t);

      await this.transactionService.commitTransaction(t);
    } catch (e) {

      await this.transactionService.rollbackTransaction(t);
      console.log(e);
    }
  }

  async update_responsible(req) {
    this.validator.execute('commercial-wallet-update-responsible.json', req.body);
    let commercial_wallet_id = req.params.id;

    let commercialWallet = await this.commercialWalletRepository
      .get_by_id(commercial_wallet_id);

    if (!commercialWallet)
      throw this.errorService
        .get('commercial_wallet_by_document_not_found');

    let responsible_analyst_old = commercialWallet.responsible_analyst;
    let responsible_analyst_new = req.body.responsible_analyst;
    if (responsible_analyst_old == responsible_analyst_new)
      throw this.errorService
        .get('commercial_wallet_param_update_is_the_same');

    let commercial_analyst = await this.commercialWalletRepository
      .getAnalystByEmail(responsible_analyst_new);

    if (!commercial_analyst)
      throw this.errorService
        .get('no_availiable_analyst_with_this_email');

    let t;
    try {
      t = await this.transactionService.startTransaction();

      await this.commercialWalletRepository.update({
        id: commercial_wallet_id
      }, {
        responsible_analyst: responsible_analyst_new
      }, t);

      await this.commercialWalletHistoryResponsiblesRepository
        .create(commercial_wallet_id, responsible_analyst_old, responsible_analyst_new, req.body.user_id, t);

      await this.transactionService.commitTransaction(t);
    } catch (e) {

      await this.transactionService.rollbackTransaction(t);
      console.log(e);
    }
  }

  async update_analyses(req) {
    this.validator.execute('commercial-wallet-update-analyses.json', req.body);
    let commercial_wallet_id = req.params.id;

    let commercialWallet = await this.commercialWalletRepository
      .get_by_id(commercial_wallet_id);

    if (!commercialWallet)
      throw this.errorService
        .get('commercial_wallet_by_document_not_found');

    let status_analyses_old = commercialWallet.status_analyses;
    let status_analyses_new = req.body.status_analyses;
    if (status_analyses_old == status_analyses_new)
      throw this.errorService
        .get('commercial_wallet_param_update_is_the_same');

    let t;
    try {
      t = await this.transactionService.startTransaction();

      await this.commercialWalletRepository.update({
        id: commercial_wallet_id
      }, {
        status_analyses: status_analyses_new,
        revaluation: req.body.revaluation
      }, t);

      await this.commercialWalletHistoryAnalysesRepository
        .create(commercial_wallet_id, status_analyses_old, status_analyses_new, req.body.reason, req.body.user_id, t);

      await this.transactionService.commitTransaction(t);
    } catch (e) {

      await this.transactionService.rollbackTransaction(t);
      console.log(e);
    }
  }

  async update_account_size(req) {
    this.validator.execute('commercial-wallet-update-account-size.json', req.body);

    let type = null;
    if (req.body.commercial_size != undefined && req.body.is_special != undefined) {
      type = 'mark_special_and_alter_size';
    } else if (req.body.commercial_size != undefined && req.body.is_special == undefined) {
      type = 'alter_size';
    } else if (req.body.commercial_size == undefined && req.body.is_special != undefined) {
      type = 'mark_special';
    } else {
      throw this.errorService
        .get('commercial_wallet_params_not_found');
    }

    let commercialWallet = await this.commercialWalletRepository
      .get_by_id(req.params.id);

    if (!commercialWallet)
      throw this.errorService
        .get('commercial_wallet_by_document_not_found');

    let t;
    let options = {};

    if (req.body.commercial_size !== undefined) {
      options.commercial_size = req.body.commercial_size;
      options.updated_commercial_size_at = new Date();
    }

    if (req.body.is_special !== undefined)
      options.is_special = req.body.is_special;

    try {
      t = await this.transactionService.startTransaction();

      await this.commercialWalletRepository.update({
        id: req.params.id
      }, options, t);

      if (req.body.commercial_size != undefined)
        await this.commercialWalletRepository.documentCommercialSizeIntranet(commercialWallet.document_id, commercialWallet.profile_id, req.body.commercial_size);

      await this.commercialWalletHistorySizesRepository
        .create(type, req.params.id, commercialWallet.commercial_size, req.body.commercial_size, req.body.is_special, req.body.user_id, t);

      await this.transactionService.commitTransaction(t);
    } catch (e) {
      await this.transactionService.rollbackTransaction(t);
      console.log(e);
    }
  }
}

module.exports = CommercialWalletBs;
