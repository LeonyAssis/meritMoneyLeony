'use strict';
class CommercialWalletHistoryResponsiblesRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async create(commercial_wallets_id, responsible_analyst_old, responsible_analyst_new, user_id, t) {
    let history = {
      commercial_wallets_id: commercial_wallets_id,
      responsible_analyst_old: responsible_analyst_old,
      responsible_analyst_new: responsible_analyst_new,
      user_id: user_id
    };
    let options = {};
    if (t)
      options = {
        transaction: t
      };
    return this.db.main
      .commercial_wallet_history_responsibles
      .create(history, options);
  }
}

module.exports = CommercialWalletHistoryResponsiblesRepository;
