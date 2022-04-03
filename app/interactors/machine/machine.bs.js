'use strict';

const Interactor = require('../interactor.bs');

class MachineBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.machineRepository = params.machineRepository;
    this.machineService = params.machineService;
    this.machineChipRepository = params.machineChipRepository;
    this.formatService = params.formatService;
    this.transactionService = params.transactionService;
    this.machineCoilStockService = params.machineCoilStockService;
    this.machineCoilStockRepository = params.machineCoilStockRepository;
    this.awsSqsService = params.awsSqsService;
    this.config = params.config;
    this.machineClientService = params.machineClientService;
    this.machineOrdersRepository = params.machineOrdersRepository;
  }

  async create(req) {
    await this.validator.execute('machine.json', req.body);

    let machines = req.body;

    const manufacturers = await this.machineRepository.listManufacturers();
    const mainManufacturer = manufacturers.find(m => m.name == 'PAX');
    const models = await this.machineRepository.listModels();

    machines = machines.map(machine => {
      if (machine.manufacturer) {
        machine.machine_manufacturer_id = manufacturers
          .find(manufacturer => manufacturer.name == machine.manufacturer)
          .id;
        delete machine['manufacturer'];
      }

      if (machine.model) {
        machine.machine_model_id = models
          .find(model => model.model == machine.model)
          .id;
        delete machine['model'];
      } else if (!machine.machine_model_id) {
        throw this.errorService
          .get('machine_model_required');
      }

      return machine;
    });

    machines
      .filter(machine => !machine.machine_manufacturer_id)
      .forEach(machine => {
        machine.machine_manufacturer_id = mainManufacturer.id;
      });

    await this.machineRepository
      .create(machines);
  }

  async list(req) {
    let paramsQuery = await this.machineService.getParametersList(req.query);

    let machines = await this.machineRepository
      .list(paramsQuery.parameters, paramsQuery.filters, paramsQuery.sorting);

    if (machines.count == 0)
      throw this.errorService
        .get('no_machine_found');

    machines = await this.machineClientService.getClientInfo(machines);

    return machines;
  }

  async update(req) {
    this.validator.execute('machine-update.json', req.body);

    const machine = await this.machineRepository
      .findById(req.params.machine_id);

    if (!machine) {
      throw this.errorService
        .get('no_machine_found');
    }

    const t = await this.transactionService.startTransaction();
    try {
      let bodyMachine = {};
      let log = null;

      if (req.body.description != undefined)
        bodyMachine.description = req.body.description;

      if (req.body.has_defect) {
        if (!machine.is_working) {
          throw this.errorService.get('machine_not_working_already');
        }

        bodyMachine.status = 'defected';
        bodyMachine.is_working = false;

        log = {
          status: 'defected',
          machine_id: machine.id,
          current_client_id: machine.machine_client_id,
          description: req.body.defect_description,
          user_id: req.body.user_id
        };
      }

      await this.machineRepository
        .update(req.params.machine_id, bodyMachine);

      if (log)
        await this.machineRepository
          .logMachine(log);

      await this.transactionService.commitTransaction(t);
    } catch (err) {
      await this.transactionService.rollbackTransaction(t);
      throw err;
    }
  }

  async details_by_id(req) {
    let machine = await this.machineRepository
      .findById(req.params.machine_id);

    if (!machine)
      throw this.errorService
        .get('no_machine_found');

    if (!machine.is_working) {
      machine.defect = await this.machineRepository
        .getDefect(machine.id);

      if (machine.defect) {
        machine.discarded = await this.machineRepository
          .getDiscarded(machine.id, machine.defect.created_at);
        machine.warranty = await this.machineRepository
          .getWarranty(machine.id, machine.defect.created_at);
      } else {
        machine.discarded = null;
        machine.warranty = null;
      }
    }

    return machine;
  }

  async details_by_serial_number(req) {

    let machine = await this.machineRepository
      .findBySerialNumber(req.params.serial_number);

    if (!machine)
      throw this.errorService
        .get('no_machine_found');

    return machine;
  }

  async list_models() {

    let machine = await this.machineRepository
      .listModels();

    return machine;
  }

  async list_manufacturers() {

    let machine = await this.machineRepository
      .listManufacturers();

    return machine;
  }

  async list_models_checklist() {

    let machine = await this.machineRepository
      .listModelsChecklist();

    return machine;
  }

  async list_by_account(req) {
    let limit = parseInt(req.query.limit) || 10;
    let offset = ((parseInt(req.query.page_number) || 1) - 1) * limit;
    let order = req.query.order || 'desc';

    let params = {
      limit: limit,
      offset: offset,
      order: order,
      account_id: req.params.account_id
    };

    let machines = await this.machineRepository
      .list_by_account(params);

    if (machines.count == 0)
      throw this.errorService
        .get('no_machine_found');

    return machines;
  }

  async link_account(req) {
    this.validator.execute('machine-link-account.json', req.body);

    let machine_id = req.params.machine_id;
    let body = req.body;
    body['machine_id'] = machine_id;

    let machine = await this.machineRepository
      .findById(machine_id);

    if (machine.length == 0)
      throw this.errorService
        .get('no_machine_found');

    if (machine[0].has_client)
      throw this.errorService
        .get('linked_machine');

    if (machine[0].machine_chip_id == null)
      throw this.errorService
        .get('no_chip_found');

    let t;
    try {
      t = await this.transactionService.startTransaction();

      let has_client = {
        has_client: 1
      };

      await this.machineRepository.link_account(body, t);
      await this.machineRepository.update(machine_id, has_client, t);

      await this.transactionService.commitTransaction(t);
    } catch (e) {
      await this.transactionService.rollbackTransaction(t);
      console.log(e);
    }
  }

  async activateClient(req) {
    let limit = parseInt(req.query.limit) || 10;
    let clients = await this.awsSqsService
      .getMessage(this.config.sqs.prod_gnpos_gis, limit);

    if (!clients) {
      throw this.errorService
        .get('no_message_returned_from_sqs');
    }

    let t;
    clients.forEach(async res => {
      let dataBody = JSON.parse(res.Body);

      let bodyMachine = {
        serial_number: dataBody.serial_number
      };
      let machine = await this.machineRepository.
        find_machine(bodyMachine);

      if (machine['machine_clients']['id']) {

        let bodyClient = {
          machine_id: machine['id'],
          profile_id: dataBody.profile_id,
          account_id: dataBody.account_id,
          activated_at: dataBody.updated_at
        };

        try {
          await this.machineRepository
            .updateClient(machine['machine_clients']['id'], bodyClient);

          await this.awsSqsService.deleteMessage(this.config.sqs.prod_gnpos_gis, res);
        } catch (e) {
          console.log(e);
        }

      } else {
        let bodyClient = {
          machine_id: machine['id'],
          profile_id: dataBody.profile_id,
          account_id: dataBody.account_id,
          activated_at: dataBody.updated_at
        };

        let user = await this.machineRepository.
          find_user({
            name: 'Sistema'
          });

        bodyClient['user_id'] = user['id'];

        try {
          t = await this.transactionService.startTransaction();

          let has_client = {
            has_client: 1
          };

          await this.machineRepository.link_account(bodyClient, t);
          await this.machineRepository.update(machine['id'], has_client, t);

          await this.transactionService.commitTransaction(t);

          await this.awsSqsService.deleteMessage(this.config.sqs.prod_gnpos_gis, res);
        } catch (e) {
          await this.transactionService.rollbackTransaction(t);
          console.log(e);
        }
      }
    });

  }

  async getQuantityMachines(req) {
    let { status, is_working } = req.query;

    let filter_status = {};

    if (status) {
      filter_status.status = status;
    }

    if (is_working) {
      is_working = ['TRUE', '1'].includes(is_working.toUpperCase());
      filter_status.is_working = is_working;
    }

    return this.machineRepository
      .getQuantityMachines(filter_status);
  }

}

module.exports = MachineBs;
