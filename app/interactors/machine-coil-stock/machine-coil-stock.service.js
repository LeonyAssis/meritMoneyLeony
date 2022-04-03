class MachineCoilStockService {

  constructor(params) {
    this.config = params;
    this.errorService = params.errorService;
    this.db = params.sequelize;
    this.machineCoilStockRepository = params.machineCoilStockRepository;
  }

  async checkStatusAndQuantity(body) {

    let quantity;
    let quantitySent;
    let quantityReceived;

    if (body.status != 'received' && body.status != 'sent')
      throw this.errorService
        .get('unrecognized_status_in_the_machine_coil_stock');

    let availableQuantity = await this.machineCoilStockRepository
      .getAvailableQuantity();

    if (body.status == 'sent') {
      if (availableQuantity[0].available_quantity < body.quantity)
        throw this.errorService
          .get('coil_stock_less_than_requested');

      quantity = availableQuantity[0].available_quantity - body.quantity;
      quantitySent = availableQuantity[0].quantity_sent + body.quantity;
    } else {
      quantity = availableQuantity[0].available_quantity + body.quantity;
      quantityReceived = availableQuantity[0].quantity_received + body.quantity;
    }

    let id = availableQuantity[0].id;

    let paramsUpdated = {
      available_quantity: quantity
    };

    if (quantitySent) {
      paramsUpdated.quantity_sent = quantitySent;
    }

    if (quantityReceived) {
      paramsUpdated.quantity_received = quantityReceived;
    }

    return { id, paramsUpdated };
  }

  async getParametersList(query) {
    const Op = this.db.Sequelize.Op;
    let limit = parseInt(query.limit) || 10;
    let offset = ((parseInt(query.page) || 1) - 1) * limit;
    let search = query.search;
    let start_date = query.start_date;
    let end_date = query.end_date;
    let status = query.status;
    let column = query.column;
    let order = query.order;

    let parameters = {
      limit: limit,
      offset: offset
    };

    let filters = {};

    let sorting = [
      ['id', 'desc']
    ];

    if (['created_at', 'amount'].includes(column)) {
      sorting = [
        [column, order == 'asc' ? 'asc' : 'desc']
      ];
    }

    if (status)
      filters['status'] = status;

    if (search) {
      let searchParam = [{
        origin: {
          [Op.like]: `%${search}%`
        }
      }, {
        description: {
          [Op.like]: `%${search}%`
        }
      }];
      filters[Op.or] = searchParam;
    }

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

module.exports = MachineCoilStockService;
