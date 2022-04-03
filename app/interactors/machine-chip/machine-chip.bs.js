'use strict';

const Interactor = require('../interactor.bs');

class MachineChipBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.transactionService = params.transactionService;
    this.machineChipRepository = params.machineChipRepository;
    this.machineChipService = params.machineChipService;
  }

  async create(req) {
    this.validator.execute('machine-chip.json', req.body);

    const chipTypes = await this.machineChipRepository.listAllChipTypes();

    const chips = req.body.map(chip => {
      chip.carrier_chip = chip.carrier_chip.toUpperCase();
      if (chip.chip_type) {
        chip.machine_chip_type_id = chipTypes
          .find(chipType => chipType.type == chip.chip_type)
          .id;
        delete chip['chip_type'];
      } else if (!chip.machine_chip_type_id) {
        throw this.errorService
          .get('chip_type_required');
      }

      return chip;
    });

    await this.machineChipRepository
      .create(chips);
  }

  async update(req) {
    this.validator.execute('machine-chip-update.json', req.body);

    const { defect, user_id, description } = req.body;

    const body = {};

    if (defect) {
      body.defect_at = new Date();
      body.defect_reported_by = user_id;
      body.status = 'defect';
    }

    if (description) {
      body.description = description;
    }

    await this.machineChipRepository.update(req.params.id, body);
  }

  async list(req) {
    let paramsQuery = await this.machineChipService.getParametersList(req.query);

    let chips = await this.machineChipRepository
      .list(paramsQuery.parameters, paramsQuery.filters, paramsQuery.sorting);

    if (chips.count == 0)
      throw this.errorService
        .get('no_chip_found');

    return chips;
  }

  async list_by_id(req) {

    let chip = await this.machineChipRepository
      .findById(req.params.id);

    if (!chip)
      throw this.errorService
        .get('no_chip_found');

    return chip;
  }

  async list_chip_types(req) {
    let limit = parseInt(req.query.limit) || 10;
    let offset = ((parseInt(req.query.page) || 1) - 1) * limit;

    let parameters = {
      offset: offset,
      limit: limit
    };

    let types = await this.machineChipRepository
      .listChipTypes(parameters);

    if (types.count == 0)
      throw this.errorService
        .get('no_chip_types_found');

    return types;
  }

  async get_by_simcard(req) {

    let chip = await this.machineChipRepository
      .findBySimcard(req.params.simcard_serial);

    if (chip.length == 0)
      throw this.errorService
        .get('no_chip_found');

    return chip;
  }

  async getAvailableQuantity() {
    let availableQuantity = await this.machineChipRepository
      .getAvailableQuantity();

    return availableQuantity;
  }

}

module.exports = MachineChipBs;
