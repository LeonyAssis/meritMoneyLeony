'use strict';
class CommercialWalletHistoryAnalysesRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async create(commercial_wallets_id, status_analyses_old, status_analyses_new, reason, user_id, t) {
    let history = {
      commercial_wallets_id: commercial_wallets_id,
      status_analyses_old: status_analyses_old,
      status_analyses_new: status_analyses_new,
      reason: reason,
      user_id: user_id
    };
    let options = {};
    if (t)
      options = {
        transaction: t
      };
    return this.db.main
      .commercial_wallet_history_analyses
      .create(history, options);
  }
}

module.exports = CommercialWalletHistoryAnalysesRepository;
