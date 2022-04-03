'use strict';

class GetBalanceService {
  constructor(params) {
    this.getBalanceRepository = params.getBalanceRepository;
  }

  async execute(account) {

    const availableSyncedBalanceData = await this.getBalanceRepository
      .getSyncedAvailableBalanceDataBy(account);

    if (!availableSyncedBalanceData)
      return 0;

    const availableNotSyncedBalance = await this.getBalanceRepository
      .getNotSyncedAvailableBalanceBy(
        account,
        availableSyncedBalanceData.lastSyncedData
      );

    return availableSyncedBalanceData.balance + availableNotSyncedBalance;
  }
}

module.exports = GetBalanceService;
