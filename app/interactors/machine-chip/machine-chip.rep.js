'use strict';
class MachineChipRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async findIdChipType(type) {
    let options = {
      where: {
        type
      },
      logging: true
    };

    return this.db.main
      .machine_chip_types
      .findOne(options);
  }

  async create(chips) {
    return this.db.main
      .machine_chips
      .bulkCreate(chips);
  }

  async update(id, body) {
    let options = {
      where: {
        id: id
      },
      logging: true
    };

    return this.db.main
      .machine_chips
      .update(body, options);
  }

  async updateLinked(id, body, t) {
    let options = {
      where: {
        id: id
      },
      raw: true
    };

    if (t)
      options['transaction'] = t;

    return this.db.main
      .machine_chips
      .update(body, options);
  }

  async list(params, filters, sorting) {
    const options = {
      where: filters,
      order: sorting,
      include: [{
        model: this.db.main.machine_chip_types,
        attributes: ['type'],
        required: false,
      }],
      offset: params.offset,
      limit: params.limit,
      nest: true,
      logging: true
    };

    return this.db.main
      .machine_chips
      .findAndCountAll(options);
  }

  async findById(id) {
    let options = {
      where: {
        id: id
      },
      include: [{
        model: this.db.main.machine_chip_types,
        attributes: ['type'],
        required: false,
      }],
      nest: true
    };

    return this.db.main
      .machine_chips
      .findOne(options);
  }

  async listChipTypes(params) {
    const options = {
      offset: params.offset,
      limit: params.limit
    };

    return this.db.main
      .machine_chip_types
      .findAndCountAll(options);
  }

  async listAllChipTypes() {
    return this.db.main
      .machine_chip_types
      .findAll();
  }

  async findBySimcard(sim_card_serial) {
    let options = {
      where: {
        sim_card_serial: sim_card_serial
      },
      include: [{
        model: this.db.main.machine_chip_types,
        attributes: ['type'],
        required: false,
      }],
      nest: true
    };

    return this.db.main
      .machine_chips
      .findOne(options);
  }

  async getAvailableQuantity() {
    let options = {
      attributes: [
        [this.db.Sequelize.fn('SUM', this.db.Sequelize.literal('CASE WHEN status = \'linked\' THEN 1 ELSE 0 END')), 'linked'],
        [this.db.Sequelize.fn('SUM', this.db.Sequelize.literal('CASE WHEN status = \'defect\' THEN 1 ELSE 0 END')), 'defect'],
        [this.db.Sequelize.fn('SUM', this.db.Sequelize.literal('CASE WHEN status = \'available\' THEN 1 ELSE 0 END')), 'available']
      ]
    };

    return this.db.main
      .machine_chips
      .findOne(options);
  }

}

module.exports = MachineChipRepository;
