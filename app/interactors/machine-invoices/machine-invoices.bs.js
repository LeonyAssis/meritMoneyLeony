'use strict';

const Interactor = require('../interactor.bs');

class MachineInvoicesBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.transactionService = params.transactionService;
    this.machineInvoicesRepository = params.machineInvoicesRepository;
    this.machineInvoicesService = params.machineInvoicesService;
    this.machineClientService = params.machineClientService;
    this.machineOrdersRepository = params.machineOrdersRepository;
  }

  async getInvoices(req) {
    let paramsQuery = await this.machineInvoicesService
      .getParametersList(req.query);

    let invoices = await this.machineInvoicesRepository
      .listInvoicesOrders(paramsQuery.filtersMachineClient, paramsQuery.filtersInvoices, paramsQuery.parameters, paramsQuery.sorting);

    invoices = await this.machineClientService
      .getClientInfo(invoices);

    return invoices;

  }

  async createInvoice(req) {
    this.validator.execute('machine-invoice-create.json', req.body);

    let order_id = parseInt(req.params.order_id);

    const invoiceTypes = await this.machineInvoicesRepository
      .getInvoiceTypes();

    const invoices = req.body.map(i => {
      i.machine_order_id = order_id;

      if (i.machine_invoice_type) {
        i.machine_invoice_types_id = invoiceTypes
          .find(invoiceType => invoiceType.type == i.machine_invoice_type)
          .id;
        delete i['machine_invoice_type'];
      } else {
        throw this.errorService
          .get('invoice_type_required');
      }
      return i;
    });

    let order = await this.machineOrdersRepository
      .getOrder(order_id);

    if (!order)
      throw this.errorService
        .get('order_not_found');

    let t;
    try {
      t = await this.transactionService.startTransaction();

      await this.machineInvoicesRepository
        .createInvoice(invoices, t);

      await this.machineOrdersRepository
        .updateOrder(order_id, {
          status: 'awaiting_shipping',
          invoice_uploaded_by: invoices[0].user_id,
          invoice_uploaded_at: new Date()
        }, t);

      await this.transactionService.commitTransaction(t);

    } catch (error) {
      await this.transactionService.rollbackTransaction(t);
      throw error;
    }
  }
}


module.exports = MachineInvoicesBs;
