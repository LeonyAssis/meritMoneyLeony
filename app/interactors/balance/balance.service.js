class BalanceService {

  constructor(params) {
    this.balanceRepository = params.balanceRepository;
    this.errorService = params.errorService;
    this.db = params.sequelize;
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

  async getParametersList(query) {
    const Op = this.db.Sequelize.Op;
    let limit = parseInt(query.limit) || 10;
    let offset = ((parseInt(query.page) || 1) - 1) * limit;
    let type = query.type || 'MONTHLY_INCOME,BUY,TRANSFER';
    let searchOrigin = query.searchOrigin;
    let searchDestiny = query.searchDestiny;
    let column = query.column;
    let order = query.order;

    let parameters = {
      limit: limit,
      offset: offset,
    };

    let filters = {};
    let filtersUserOrigin = {};
    let filtersUserDestiny = {};

    let sorting = [
      ['created_at', 'desc'],
      ['id', 'desc']
    ];

    if (['created_at'].includes(column)) {
      sorting = [
        [column, order == 'asc' ? 'asc' : 'desc'],
        ['id', order == 'asc' ? 'asc' : 'desc']
      ];
    }

    filters['type'] = type.replaceAll(" ", "").split(",");


    if (searchOrigin)
      filtersUserOrigin['name'] = {
        [Op.like]: `%${searchOrigin}%`
      };

    if (searchDestiny) {
      filtersUserDestiny['name'] = {
        [Op.like]: `%${searchDestiny}%`
      };

    }

    return { parameters, filters, sorting, filtersUserOrigin, filtersUserDestiny };
  }


}

module.exports = BalanceService;




