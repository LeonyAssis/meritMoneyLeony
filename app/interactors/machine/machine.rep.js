'use strict';

class machineRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async create(machines, t) {
    const options = {};

    if (t) {
      options['transaction'] = t;
    }

    const resultCreate = await this.db.main
      .machines
      .bulkCreate(machines, options);

    const logs = resultCreate.map(m => {
      return {
        machine_id: m.id,
        status: 'in_stock',
        user_id: m.user_id
      };
    });

    await this.logMachine(logs);

    return resultCreate;
  }

  async list(params, filters, sorting) {
    const options = {
      where: filters,
      order: sorting,
      include: [{
        model: this.db.main.machine_models,
        required: true
      },
      {
        model: this.db.main.machine_manufacturers,
        required: true
      },
      {
        model: this.db.main.machine_chips,
        required: false,
        include: [{
          model: this.db.main.machine_chip_types,
          attributes: ['type'],
          required: true,
        }]
      },
      {
        model: this.db.main.machine_clients,
        required: false
      }
      ],
      nest: true,
      offset: params.offset,
      limit: params.limit,
      logging: true
    };

    return this.db.main
      .machines
      .findAndCountAll(options);
  }

  async update(machine_id, updates, t) {
    const options = {
      where: {
        id: machine_id
      }
    };

    if (t)
      options['transaction'] = t;

    return this.db.main
      .machines
      .update(updates, options);
  }

  async logMachine(log, t) {
    const options = {};

    if (t) {
      options['transaction'] = t;
    }

    if (Array.isArray(log)) {
      this.db.main
        .machine_logs
        .bulkCreate(log, options);
    } else {
      this.db.main
        .machine_logs
        .create(log, options);
    }
  }

  async updateClient(client_id, updates, t) {
    const options = {
      where: {
        id: client_id
      }
    };

    if (t)
      options['transaction'] = t;

    return this.db.main
      .machine_clients
      .update(updates, options);
  }

  async getDefect(machine_id) {
    return this.db.main
      .machine_logs
      .findOne({
        where: {
          machine_id: machine_id,
          status: 'defected'
        },
        order: [
          ['created_at', 'desc']
        ]
      });
  }

  async getDiscarded(machine_id, date) {
    const Op = this.db.Sequelize.Op;
    return this.db.main
      .machine_logs
      .findOne({
        where: {
          machine_id: machine_id,
          status: 'discarded',
          created_at: {
            [Op.gte]: date
          }
        },
        order: [
          ['created_at', 'desc']
        ]
      });
  }

  async getWarranty(machine_id, date) {
    const Op = this.db.Sequelize.Op;
    return this.db.main
      .machine_logs
      .findOne({
        where: {
          machine_id: machine_id,
          status: 'warranty',
          created_at: {
            [Op.gte]: date
          }
        },
        order: [
          ['created_at', 'desc']
        ]
      });
  }

  async get_machine_chip(conditions) {
    const options = {
      where: conditions
    };

    return this.db.main
      .machine_chips
      .findOne(options);
  }

  async findById(id) {
    let options = {
      where: {
        id: id
      },
      include: [{
        model: this.db.main.machine_models,
        attributes: ['model', 'quantity_coil'],
        required: true
      },
      {
        model: this.db.main.machine_manufacturers,
        required: true
      },
      {
        model: this.db.main.machine_chips,
        required: false,
        include: [{
          model: this.db.main.machine_chip_types,
          attributes: ['type'],
          required: false,
        }]
      },
      {
        model: this.db.main.machine_clients,
        required: false
      }
      ],
      nest: true
    };

    return this.db.main
      .machines
      .findOne(options);
  }

  async findBySerialNumber(serial_number) {
    let options = {
      where: {
        serial_number: serial_number
      },
      include: [{
        model: this.db.main.machine_models,
        required: false
      }, {
        model: this.db.main.machine_manufacturers,
        required: false
      }
      ],
      nest: true
    };

    return this.db.main
      .machines
      .findOne(options);
  }

  async listModels() {
    return this.db.main
      .machine_models
      .findAll();
  }

  async listManufacturers() {
    return this.db.main
      .machine_manufacturers
      .findAll();
  }

  async listModelsChecklist() {
    return this.db.main
      .machine_models
      .findAll({
        include: [{
          model: this.db.main.machine_model_checklists,
          attributes: ['description'],
          where: {
            active: true
          },
          required: false
        }],
        order: [
          ['id', 'asc'],
          [this.db.main.machine_model_checklists, 'order', 'asc']
        ]
      });
  }

  async list_by_account(params) {
    const options = {
      where: {
        account_id: params.account_id
      },
      order: [
        ['created_at', params.order]
      ],
      include: [{
        model: this.db.main.machines,
        attributes: ['serial_number', 'status', 'blocked_at'],
        required: false,
        include: [{
          model: this.db.main.machine_chips,
          required: false,
          include: [{
            model: this.db.main.machine_chip_types,
            attributes: ['type'],
            required: false,
          }]
        }, {
          model: this.db.main.machine_models,
          attributes: ['model'],
          required: false
        }]
      }],
      raw: true,
      nest: true,
      offset: params.offset,
      limit: params.limit,
      logging: true
    };

    return this.db.main
      .machine_clients
      .findAndCountAll(options);
  }

  async link_account(body, t) {
    return this.db.main
      .machine_clients
      .create(body, {
        transaction: t
      });
  }

  async find_machine(filters) {
    const options = {
      where: filters,
      include: [{
        model: this.db.main.machine_clients,
        attributes: ['id', 'profile_id', 'account_id'],
        where: {
          status: 'linked'
        },
        required: false
      }],
      raw: true,
      nest: true,
      logging: true
    };

    return this.db.main
      .machines
      .findOne(options);
  }

  async find_user(filters) {
    const options = {
      where: filters,
      raw: true,
      nest: true,
      logging: true
    };

    return this.db.intranet.user
      .findOne(options);
  }

  async getQuantityMachines(filter_status) {
    let options = {
      include: [{
        model: this.db.main.machine_models,
        attributes: [],
        required: true
      }],
      attributes: [
        [this.db.Sequelize.fn('SUM', this.db.Sequelize.literal('CASE WHEN machine_model.model = \'D195\' THEN 1 ELSE 0 END')), 'total_D195'],
        [this.db.Sequelize.fn('SUM', this.db.Sequelize.literal('CASE WHEN machine_model.model = \'S920\' THEN 1 ELSE 0 END')), 'total_S920'],
        [this.db.Sequelize.fn('COUNT', '*'), 'total']
      ],
      where: filter_status,
      raw: true
    };

    return this.db.main
      .machines
      .findOne(options)
      .then(result => {
        result.total_D195 = result.total_D195 ? parseInt(result.total_D195) : 0;
        result.total_S920 = result.total_S920 ? parseInt(result.total_S920) : 0;
        return result;
      });
  }

}

module.exports = machineRepository;
