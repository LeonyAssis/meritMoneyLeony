'use strict';

const Interactor = require('../interactor.bs');

class CommercialWalletBalancingBs extends Interactor {

  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.dateService = params.dateService;
    this.constants = params.constants;
    this.commercialWalletBalancingService = params.commercialWalletBalancingService;
    this.commercialWalletBalancingRepository = params.commercialWalletBalancingRepository;
  }

  async execute(req) {

    let limit = parseInt(req.limit) || 10;
    let type = req.type || 'conta_ativar';

    let commercialWallets = await this.commercialWalletBalancingRepository
      .getCommercialWalletsWithoutAnalyst(limit, type);
    let walletsWithoutAnyAnalyst = [];
    console.log(commercialWallets);
    if (commercialWallets.length == 0)
      throw this.errorService
        .get('commercial_wallets_not_found');

    for (let wallet of commercialWallets) {
      let actualAnalyst = await this.commercialWalletBalancingRepository
        .verifyAnalystByProfileId(wallet.profile_id);
      if (actualAnalyst.length > 0) {
        await this.commercialWalletBalancingRepository
          .updateCommercialWalletAnalyst(wallet.document_id, actualAnalyst[0].responsible_analyst);
      } else {
        walletsWithoutAnyAnalyst.push(wallet);
      }
    }

    let commercialAnalystsPermissions = await this.commercialWalletBalancingRepository
      .getCommercialAnalystsPermissions();

    for (let wallet of walletsWithoutAnyAnalyst) {
      let totalByAnalyst = await this.commercialWalletBalancingRepository
        .getTotalCommercialWalletsByAnalyst();
      let analyst = await this.commercialWalletBalancingService
        .defineAnalyst(wallet, commercialAnalystsPermissions, totalByAnalyst);
      await this.commercialWalletBalancingRepository
        .updateCommercialWalletAnalyst(wallet.document_id, analyst.responsible_analyst);
    }
  }
}

module.exports = CommercialWalletBalancingBs;
