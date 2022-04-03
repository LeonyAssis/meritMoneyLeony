'use strict';
class CommercialWalletHistorySizesRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async create(type, commercial_wallet_id, size_old, size_new, is_special, user_id, t) {
    let history = {
      type: type,
      commercial_wallets_id: commercial_wallet_id,
      size_old: size_old,
      size_new: size_new,
      is_special: is_special,
      user_id: user_id
    };
    let options = {};
    if (t)
      options = {
        transaction: t
      };
    return this.db.main
      .commercial_wallet_history_sizes
      .create(history, options);
  }
}

module.exports = CommercialWalletHistorySizesRepository;
