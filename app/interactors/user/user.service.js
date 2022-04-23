class UserService {

  constructor(params) {
    this.config = params;
    this.errorService = params.errorService;
    this.db = params.sequelize;
  }


  async getParametersList(query) {
    const Op = this.db.Sequelize.Op;
    let limit = parseInt(query.limit) || 10;
    let offset = ((parseInt(query.page) || 1) - 1) * limit;
    let active = query.active || true;
    let search = query.search;
    let column = query.column;
    let order = query.order;

    let parameters = {
      limit: limit,
      offset: offset,
    };

    let filters = {};

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

    filters['active'] = active;

    if (search)
      filters['email'] = {
        [Op.like]: `%${search}%`
      };

    return { parameters, filters, sorting };
  }

}

module.exports = UserService;
