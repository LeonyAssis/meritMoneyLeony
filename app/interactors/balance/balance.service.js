class BalanceService {

  constructor(params) {
    this.balanceRepository = params.balanceRepository;
    this.errorService = params.errorService;
  }

  async checkUsersAndBalance(owner, senTo, value) {
    const balanceOwner = await this.balanceRepository
      .getBalanceAndUser(owner);

    if (!balanceOwner)
      throw this.errorService
        .get('owner_or_balance_not_found');

    const balanceReceiver = await this.balanceRepository
      .getBalanceAndUser(senTo);

    if (!balanceReceiver)
      throw this.errorService
        .get('receiver_or_balance_not_found');

        
    if (balanceOwner.balance < value)
      throw this.errorService
        .get('owner_does_not_have_enough_balance');

    return { balanceOwner, balanceReceiver };
  }


  async compareAndMoveBalance(owner, senTo) {

  }

}

module.exports = BalanceService;