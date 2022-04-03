'use strict';
class MachineCoilStockRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async getAvailableQuantity() {
    return this.db.main
      .machine_coil_stock
      .findOne({});
  }

  async create(record, t) {
    return this.db.main
      .machine_coil_stock_logs
      .create(record, {
        transaction: t
      });
  }

  async updateStock(amount, status, transaction) {
    let quantity_received = 0;
    let quantity_sent = 0;

    if (status == 'received') {
      quantity_received += amount;
    } else if (status == 'canceled') {
      quantity_sent -= amount;
    } else {
      quantity_sent += amount;
    }

    let available_quantity = quantity_received - quantity_sent;

    return this.db.main
      .machine_coil_stock
      .increment({
        available_quantity: available_quantity,
        quantity_received: quantity_received,
        quantity_sent: quantity_sent
      }, {
        where: {},
        transaction,
        logging: true
      });
  }

  async list(params, filters, sorting) {
    const options = {
      where: filters,
      order: sorting,
      offset: params.offset,
      limit: params.limit,
      logging: true,
      include: [{
        model: this.db.main.machine_clients,
        required: false
      }]
    };

    return this.db.main
      .machine_coil_stock_logs
      .findAndCountAll(options);
  }

}

module.exports = MachineCoilStockRepository;
