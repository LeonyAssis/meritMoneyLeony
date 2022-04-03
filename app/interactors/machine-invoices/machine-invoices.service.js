/* eslint-disable quotes */
console.log(); class MachineInvoicesService {

  constructor(params) {
    this.config = params;
    this.errorService = params.errorService;
    this.db = params.sequelize;
    this.machineOrdersRepository = params.machineOrdersRepository;
  }

  async getParametersList(query) {
    const Op = this.db.Sequelize.Op;
    let limit = parseInt(query.limit) || 10;
    let offset = ((parseInt(query.page) || 1) - 1) * limit;
    let search = query.search;
    let startDate = query.start_date;
    let endDate = query.end_date;
    let status = query.status;
    let column = query.column;
    let order = query.order;

    let parameters = {
      limit: limit,
      offset: offset
    };

    let filtersMachineClient = {};
    let filtersInvoices = {};

    let sorting = [
      [this.db.Sequelize.literal("CASE WHEN `machine_orders`.`status` = 'awaiting_invoice' THEN 1 WHEN `machine_orders`.`status` = 'awaiting_shipping' THEN 2 ELSE 3 END"), 'asc'],
      ['created_at', 'desc']
    ];

    if (['created_at'].includes(column)) {
      sorting = [
        [column, order == 'asc' ? 'asc' : 'desc']
      ];
    }

    let ids;
    if (search && Number.isInteger(parseInt(search))) {
      filtersInvoices['id'] = search;
    } else if (search) {
      ids = await this.machineOrdersRepository
        .getAccountsIdsByQueryName(search);

      filtersMachineClient['account_id'] = {
        [Op.in]: ids
      };
    }

    if (status) {
      let statusTemp = [];
      statusTemp = status.split(',');
      let statusQueryFilter = statusTemp.filter(el => el != '');

      if (statusQueryFilter.length > 1) {
        filtersInvoices['status'] = {
          [Op.in]: statusQueryFilter
        };
      } else {
        filtersInvoices['status'] = statusQueryFilter[0];
      }
    }

    if (startDate && endDate) {
      filtersInvoices['created_at'] = {
        [Op.between]: [`${startDate} 00:00:00`, `${endDate} 23:59:59`]
      };
    } else if (startDate) {
      filtersInvoices['created_at'] = {
        [Op.gte]: `${startDate} 00:00:00`
      };
    } else if (endDate) {
      filtersInvoices['created_at'] = {
        [Op.lte]: `${endDate} 23:59:59`
      };
    }

    return { parameters, filtersMachineClient, filtersInvoices, sorting };
  }

}

module.exports = MachineInvoicesService;
