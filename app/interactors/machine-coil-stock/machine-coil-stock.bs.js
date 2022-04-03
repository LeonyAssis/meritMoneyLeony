'use strict';

const Interactor = require('../interactor.bs');

class MachineCoilStockBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.transactionService = params.transactionService;
    this.machineCoilStockRepository = params.machineCoilStockRepository;
    this.machineCoilStockService = params.machineCoilStockService;
    this.machineClientService = params.machineClientService;
  }

  async create(req) {
    this.validator.execute('machine-coil-stock.json', req.body);

    let { status, machine_client, amount, description, gn_purchase_invoice } = req.body;
    const { profile_id, account_id } = machine_client || {};

    let machine_client_id = null;

    if (status == 'sent') {
      machine_client_id = await this.machineClientService
        .getOrCreateClientId(profile_id, account_id);
      gn_purchase_invoice = null;
    }

    if (!description) {
      description = status == 'received' ? 'Recebimento' : 'Envio';
    }

    const t = await this.transactionService.startTransaction();
    try {
      const payload = Object.assign(req.body, {
        description,
        gn_purchase_invoice,
        machine_client_id
      });

      await this.machineCoilStockRepository
        .create(payload, t);

      await this.machineCoilStockRepository
        .updateStock(amount, status, t);

      await this.transactionService.commitTransaction(t);
    } catch (e) {
      await this.transactionService.rollbackTransaction(t);
      throw e;
    }
  }

  async list(req) {
    let paramsQuery = await this.machineCoilStockService.getParametersList(req.query);

    let coils = await this.machineCoilStockRepository
      .list(paramsQuery.parameters, paramsQuery.filters, paramsQuery.sorting);

    if (coils.count == 0)
      throw this.errorService
        .get('coil_stock_logs_not_found');

    coils = await this.machineClientService.getClientInfo(coils);

    return coils;
  }

  async getAvailableQuantity() {
    let availableQuantity = await this.machineCoilStockRepository
      .getAvailableQuantity();

    return availableQuantity;
  }

}

module.exports = MachineCoilStockBs;
