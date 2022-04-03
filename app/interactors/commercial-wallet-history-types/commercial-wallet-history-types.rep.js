'use strict';
class CommercialWalletHistoryTypesRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async create(commercial_wallets_id, type_old, type_new, user_id, t) {
    let history = {
      commercial_wallets_id: commercial_wallets_id,
      type_old: type_old,
      type_new: type_new,
      user_id: user_id
    };
    let options = {};
    if (t)
      options = {
        transaction: t
      };
    return this.db.main
      .commercial_wallet_history_types
      .create(history, options);
  }
}

module.exports = CommercialWalletHistoryTypesRepository;
