class CommercialWalletBalancingService {

  async defineAnalyst(wallet, commercialAnalystsPermissions, totalByAnalyst) {

    let filteredAnalystPermissions = [];

    if (wallet.is_special == 1) {
      filteredAnalystPermissions = commercialAnalystsPermissions
        .filter(analyst => analyst.special_accounts == 1 && analyst[wallet.commercial_size] == 1)
        .map(element => element.email);
    } else {
      filteredAnalystPermissions = commercialAnalystsPermissions
        .filter(analyst => analyst[wallet.commercial_size] == 1)
        .map(element => element.email);
    }

    let allowedAnalysts = [];
    filteredAnalystPermissions.forEach(email => {
      let tempAnalyst = totalByAnalyst.find(l => l.responsible_analyst == email);

      if (tempAnalyst == undefined) {
        allowedAnalysts.push({ responsible_analyst: email, total_wallets: 0 });
      } else {
        allowedAnalysts.push(tempAnalyst);
      }
    });

    let totalArray = allowedAnalysts.map(element => element.total_wallets);
    let analyst = totalArray.indexOf(Math.min(...totalArray));

    return allowedAnalysts[analyst];
  }
}

module.exports = CommercialWalletBalancingService;
