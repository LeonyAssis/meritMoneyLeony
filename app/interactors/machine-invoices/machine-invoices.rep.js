'use strict';

class machineInvoicesRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async listInvoicesOrders(filtersClient, filtersInvoices, params, sorting) {
    const options = {
      include: [{
        model: this.db.main.machine_order_address,
        attributes: ['street', 'number', 'reference', 'neighborhood', 'zipcode', 'city', 'state'],
        required: true,
      }, {
        model: this.db.main.machine_clients,
        where: filtersClient,
        required: true,
      },
      {
        model: this.db.main.machine_invoices,
        required: false
      }],
      attributes: ['id', 'machine_client_id', 'status', 'machine_order_address_id', 'machine_order_shipping_id', 'user_id', 'created_at'],
      where: filtersInvoices,
      nest: true,
      logging: true,
      order: sorting,
      offset: params.offset,
      limit: params.limit,
      distinct: true,
    };

    return this.db.main
      .machine_orders
      .findAndCountAll(options);
  }

  async createInvoice(invoices, t) {
    return this.db.main
      .machine_invoices
      .bulkCreate(invoices, {
        transaction: t
      });
  }

  async getInvoiceTypes() {
    return this.db.main
      .machine_invoice_types
      .findAll();
  }
}

module.exports = machineInvoicesRepository;
