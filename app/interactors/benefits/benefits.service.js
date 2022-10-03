class BenefitsService {
  constructor(params) {
    this.errorService = params.errorService;
    this.db = params.sequelize;
  }


  async mountOpts(query) {
    const Op = this.db.Sequelize.Op;
    let column = query.column;
    let limit = parseInt(query.limit) || 10;
    let offset = ((parseInt(query.page) || 1) - 1) * limit;
    let order = query.order;
    let name = query.name;
    let brand = query.brand;
    let active = query.active || true;
    let filters = {};

    let parameters = {
      limit: limit,
      offset: offset,
    };

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

    if (name)
      filters['name'] = {
        [Op.like]: `%${name}%`
      };

    if (brand)
      filters['brand'] = {
        [Op.like]: `%${brand}%`
      };

    filters['active'] = active;

    return { parameters, filters, sorting };

  }
}

module.exports = BenefitsService;