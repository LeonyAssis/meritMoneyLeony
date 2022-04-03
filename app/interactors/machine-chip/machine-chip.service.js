class MachineChipService {

  constructor(params) {
    this.config = params;
    this.errorService = params.errorService;
    this.db = params.sequelize;
    this.machineCoilStockRepository = params.machineCoilStockRepository;
  }


  async getParametersList(query) {
    const Op = this.db.Sequelize.Op;
    let limit = parseInt(query.limit) || 10;
    let offset = ((parseInt(query.page) || 1) - 1) * limit;
    let status = query.status;
    let carrier_chip = query.carrier_chip;
    let search = query.search;
    let start_date = query.start_date;
    let end_date = query.end_date;
    let column = query.column;
    let order = query.order;

    let parameters = {
      limit: limit,
      offset: offset,
    };

    let filters = {};

    let sorting = [
      ['status', 'asc'],
      ['created_at', 'desc'],
      ['id', 'desc']
    ];

    if (['created_at'].includes(column)) {
      sorting = [
        ['status', 'asc'],
        [column, order == 'asc' ? 'asc' : 'desc'],
        ['id', order == 'asc' ? 'asc' : 'desc']
      ];
    }

    // if (status == 'available') {
    //   filters['linked_at'] = null;
    //   filters['defect_at'] = null;
    // } else if (status == 'linked') {
    //   filters['linked_at'] = {
    //     [Op.ne]: null
    //   };
    //   filters['defect_at'] = null;
    // } else if (status == 'defect') {
    //   filters['defect_at'] = {
    //     [Op.ne]: null
    //   };
    // }

    if (status) {
      filters['status'] = status;
    }

    if (carrier_chip)
      filters['carrier_chip'] = carrier_chip;

    if (search)
      filters['sim_card_serial'] = {
        [Op.like]: `%${search}%`
      };

    if (start_date && end_date) {
      filters['created_at'] = {
        [Op.between]: [`${start_date} 00:00:00`, `${end_date} 23:59:59`]
      };
    } else if (start_date) {
      filters['created_at'] = {
        [Op.gte]: `${start_date} 00:00:00`
      };
    } else if (end_date) {
      filters['created_at'] = {
        [Op.lte]: `${end_date} 23:59:59`
      };
    }

    return { parameters, filters, sorting };
  }

}

module.exports = MachineChipService;
