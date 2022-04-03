class MachineService {

  constructor(params) {
    this.config = params;
    this.errorService = params.errorService;
    this.db = params.sequelize;
    this.machineRepository = params.machineRepository;
    this.formatService = params.formatService;
    this.moment = params.moment;
  }

  async getParametersList(query) {
    const Op = this.db.Sequelize.Op;
    let limit = parseInt(query.limit) || 10;
    let offset = ((parseInt(query.page) || 1) - 1) * limit;
    let search = query.search;
    let status = query.status;
    let machine_manufacturer_id = query.machine_manufacturer_id;
    let machine_model_id = query.machine_model_id;
    let column = query.column;
    let order = query.order;
    let is_working = query.is_working;
    let serial_number = query.serial_number;
    console.log(serial_number);
    let parameters = {
      limit: limit,
      offset: offset
    };

    let filters = {};

    let sorting = [
      ['created_at', 'desc'],
      ['id', 'desc']
    ];

    if (['serial_number', 'gn_purchase_invoice'].includes(column)) {
      sorting = [
        [column, order == 'asc' ? 'asc' : 'desc']
      ];
    }

    if (search) {
      let searchParam = [{
        gn_purchase_invoice: {
          [Op.like]: `%${search}%`
        }
      }, {
        serial_number: {
          [Op.like]: `%${search}%`
        }
      }];
      filters[Op.or] = searchParam;
    }

    if (serial_number) {
      filters['serial_number'] = {
        [Op.like]: `%${serial_number}%`
      };
    }

    if (status) {
      filters['status'] = status;
    }

    if (is_working) {
      is_working = ['TRUE', '1'].includes(is_working.toUpperCase());
      filters['is_working'] = is_working;
    }

    if (machine_model_id) {
      filters['machine_model_id'] = machine_model_id;
    }

    if (machine_manufacturer_id) {
      filters['machine_manufacturer_id'] = machine_manufacturer_id;
    }

    return { parameters, filters, sorting };
  }

}

module.exports = MachineService;
