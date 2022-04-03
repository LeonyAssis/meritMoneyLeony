'use strict';

class MachineOrdersRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async createOrderAddress(orderAddress, t) {
    return this.db.main
      .machine_order_address
      .create(orderAddress, {
        transaction: t
      });
  }

  async createOrder(order, t) {
    return this.db.main
      .machine_orders
      .create(order, {
        transaction: t
      });
  }

  async createOrderProducts(orderProducts, t) {
    return this.db.main
      .machine_order_products
      .create(orderProducts, {
        transaction: t
      });
  }

  async createShipping(shipping, t) {
    return this.db.main
      .machine_order_shipping
      .create(shipping, {
        transaction: t
      });
  }

  async createMachineLog(body, t) {

    return this.db.main
      .machine_logs
      .create(body, {
        transaction: t
      });
  }

  async listOrders(filtersClient, filtersOrders, params, sorting) {
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
        model: this.db.main.machine_order_shipping,
        required: false,
      },
      {
        model: this.db.main.machine_invoices,
        attributes: ['id', 'invoice', 'url', 'machine_invoice_types_id'],
        required: false
      }],
      where: filtersOrders,
      nest: true,
      order: sorting,
      offset: params.offset,
      limit: params.limit,
      distinct: true,
    };

    return this.db.main
      .machine_orders
      .findAndCountAll(options);
  }

  async getInvoices(order) {
    const options = {
      include: [{
        model: this.db.main.machine_invoice_types,
        attributes: ['type'],
        required: true,
      },
      ],
      attributes: ['id', 'invoice', 'user_id', 'machine_invoice_types_id', 'url', 'created_at', 'updated_at'],
      where: {
        machine_order_id: order
      },
      raw: true
    };

    let result = await this.db.main
      .machine_invoices
      .findAll(options);

    return result.length == 0 ? null : result;

  }

  async getAccountsIdsByQueryCpfOrCnpj(search) {
    const Op = this.db.Sequelize.Op;

    let optionsCPF = {
      attributes: ['id'],
      include: [{
        model: this.db.core.document,
        required: true,
        include: [{
          model: this.db.core.profile,
          required: true,
          where: {
            cpf: {
              [Op.like]: `%${search}%`
            }
          }
        }]
      }],
      raw: true
    };

    let accountsProfilesId = await this.db.core.account
      .findAll(optionsCPF);
    accountsProfilesId = accountsProfilesId.map(r => r.id);

    let optionsCNPJ = {
      attributes: ['id'],
      include: [{
        model: this.db.core.document,
        required: true,
        include: [{
          model: this.db.core.corporation,
          required: true,
          where: {
            cnpj: {
              [Op.like]: `%${search}%`
            }
          }
        }]
      }],
      raw: true
    };

    let accountsCorporationsId = await this.db.core.account
      .findAll(optionsCNPJ);
    accountsCorporationsId = accountsCorporationsId.map(r => r.id);

    return [...new Set([...accountsProfilesId, ...accountsCorporationsId])];
  }

  async getAccountsIdsByQueryName(search) {
    const Op = this.db.Sequelize.Op;

    let optionsAccount = {
      attributes: ['id'],
      include: [{
        model: this.db.core.document,
        required: true,
        include: [{
          model: this.db.core.profile,
          required: true,
          where: {
            name: {
              [Op.like]: `%${search}%`
            }
          }
        }]
      }],
      raw: true
    };

    let accountsProfilesId = await this.db.core.account
      .findAll(optionsAccount);

    accountsProfilesId = accountsProfilesId.map(r => r.id);

    let optionsCorporation = {
      attributes: ['id'],
      include: [{
        model: this.db.core.document,
        required: true,
        include: [{
          model: this.db.core.corporation,
          required: true,
          where: {
            name: {
              [Op.like]: `%${search}%`
            }
          }
        }]
      }],
      raw: true
    };
    let accountsCorporationsId = await this.db.core.account
      .findAll(optionsCorporation);

    accountsCorporationsId = accountsCorporationsId.map(r => r.id);

    return [...new Set([...accountsProfilesId, ...accountsCorporationsId])];
  }

  async getOrder(id) {
    const options = {
      include: [{
        model: this.db.main.machine_order_address,
        attributes: ['street', 'number', 'reference', 'neighborhood', 'zipcode', 'city', 'state'],
        required: true,
      }, {
        model: this.db.main.machine_clients,
        required: true,
      },
      {
        model: this.db.main.machine_order_shipping,
        required: false,
        include: [{
          model: this.db.main.correios_labels,
          require: false,
          include: {
            model: this.db.main.correios_plp,
            require: false
          }
        }]
      },
      {
        model: this.db.main.machine_order_shipping_settings,
        required: false
      },
      {
        model: this.db.main.machine_invoices,
        attributes: ['id', 'invoice', 'value', 'url', 'intranet_generic_file_id', 'machine_invoice_types_id'],
        required: false,
        include: [{
          model: this.db.main.machine_invoice_types,
          attributes: ['type'],
          required: true
        }]
      },
      {
        model: this.db.main.machine_order_products,
        attributes: ['id', 'price', 'discount', 'acquisition_type', 'machine_model_id', 'machine_id', 'created_at', 'updated_at'],
        required: true,
        include: [{
          model: this.db.main.machine_models,
          attributes: ['model', 'quantity_coil'],
          required: false
        },
        {
          model: this.db.main.machines,
          required: false,
          include: [{
            model: this.db.main.machine_models,
            attributes: ['model', 'quantity_coil'],
            required: false
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
          ]
        }]
      },
      ],
      nest: true,
      where: {
        id
      },
      order: [
        [this.db.main.machine_order_products, 'acquisition_type', 'asc'],
        [this.db.main.machine_invoices, this.db.main.machine_invoice_types, 'type', 'asc']
      ],

    };

    return this.db.main
      .machine_orders
      .findOne(options);
  }

  async getOrderByMachineId(machine_id) {
    const product = await this.db.main
      .machine_order_products
      .findOne({
        where: {
          machine_id: machine_id
        },
        order: [
          ['created_at', 'desc']
        ]
      });

    if (!product) {
      return null;
    }

    return this.getOrder(product.machine_order_id);
  }

  async updateShipping(id, body, t) {
    let options = {
      where: {
        id: id
      },
      raw: true,
    };

    if (t)
      options['transaction'] = t;

    return this.db.main
      .machine_order_shipping
      .update(body, options);
  }

  async updateOrder(id, body, t) {

    let options = {
      where: {
        id: id
      },
      raw: true,
    };

    if (t)
      options['transaction'] = t;

    return this.db.main
      .machine_orders
      .update(body, options);
  }

  async getOrderProducts(order_id) {
    let options = {
      where: {
        machine_orders_id: order_id
      },
      attributes: ['price', 'discount', 'acquisition_type', 'machine_models_id', 'machines_id', 'created_at', 'updated_at'],
      raw: true,
    };


    return this.db.main
      .machine_order_products
      .findAll(options);
  }

  async checkMachineStatus(machine_id) {
    let options = {
      where: {
        id: machine_id
      },
      attributes: ['id', 'status'],
      raw: true,
    };


    return this.db.main
      .machines
      .findOne(options);
  }

  async checkChipStatus(chip_id) {
    let options = {
      where: {
        id: chip_id
      },
      attributes: ['id', 'status'],
      raw: true,

    };

    return await this.db.main
      .machine_chips
      .findOne(options);
  }

  async updateProduct(product_id, body, t) {
    let options = {
      where: {
        id: product_id
      }
    };

    if (t)
      options['transaction'] = t;

    return this.db.main
      .machine_order_products
      .update(body, options);

  }

  async updateChip(chip_id, t, type = 'single') {
    let body, options;

    if (type == 'single') {
      body = {
        status: 'linked',
        linked_at: Date.now()
      };
      options = {
        where: {
          id: chip_id
        }
      };
    } else {
      const Op = this.db.Sequelize.Op;
      body = {
        status: 'available',
        linked_at: null
      };
      options = {

        where: {
          id: {
            [Op.in]: chip_id
          }
        }
      };
    }

    if (t)
      options['transaction'] = t;

    return this.db.main
      .machine_chips
      .update(body, options);

  }

  async updateMachine(machine_id, body, t, type = 'single') {
    let options;

    if (type == 'single') {
      options = {
        where: {
          id: machine_id
        }
      };
    } else {
      const Op = this.db.Sequelize.Op;
      options = {
        where: {
          id: {
            [Op.in]: machine_id
          }
        },
      };
    }

    if (t)
      options['transaction'] = t;

    return this.db.main
      .machines
      .update(body, options);

  }

  async createMachineOrderShippingSettings(payload, options = {}) {
    return this.db.main
      .machine_order_shipping_settings
      .create(payload, options);
  }

  async getMachineGeneralShippingSettings() { // TODO getMachineShippingSettings
    return this.db.main
      .machine_general_shipping_settings
      .findOne();
  }


}

module.exports = MachineOrdersRepository;
