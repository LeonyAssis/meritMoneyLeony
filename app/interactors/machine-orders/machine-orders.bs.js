'use strict';

const Interactor = require('../interactor.bs');

class MachineOrdersBs extends Interactor {
  constructor(params) {
    super();
    this.gnLogger = params.gnLogger;
    this.errorService = params.errorService;
    this.validator = params.validatorService;
    this.transactionService = params.transactionService;
    this.machineOrdersRepository = params.machineOrdersRepository;
    this.machineOrdersService = params.machineOrdersService;
    this.machineClientService = params.machineClientService;
    this.machineCoilStockRepository = params.machineCoilStockRepository;
    this.shippingService = params.shippingService;
    this.correiosService = params.correiosService;
    this.correiosRepository = params.correiosRepository;
    this.transactionService = params.transactionService;
    this.correiosGuidesService = params.correiosGuidesService;
  }

  async create(req) {
    this.validator.execute('machine-orders.json', req);

    let orderReq = req;
    let amount_products = 0;

    orderReq.machine_order_products.forEach(l => {
      amount_products += l.quantity;
    });
    orderReq.amount_products = amount_products;

    let t;

    try {
      t = await this.transactionService.startTransaction();

      let orderAddress = await this.machineOrdersRepository
        .createOrderAddress(orderReq.machine_order_address, t);

      const clientId = await this.machineClientService
        .getOrCreateClientId(orderReq.machine_client.profile_id, orderReq.machine_client.account_id);

      orderReq.machine_client_id = clientId;
      orderReq.machine_order_address_id = orderAddress.id;

      const order = await this.machineOrdersRepository
        .createOrder(orderReq, t);

      for (let machineType of orderReq.machine_order_products) {
        for (let i = 0; i < machineType.quantity; i++) {
          machineType.machine_order_id = order.id;

          await this.machineOrdersRepository
            .createOrderProducts(machineType, t);
        }
      }

      await this.transactionService.commitTransaction(t);
    } catch (e) {
      await this.transactionService.rollbackTransaction(t);
      console.log(e);
    }
  }

  async listOrders(req) {
    let paramsQuery = await this.machineOrdersService.getParametersList(req.query);
    let orders = await this.machineOrdersRepository
      .listOrders(paramsQuery.filtersMachineClient, paramsQuery.filtersOrders, paramsQuery.parameters, paramsQuery.sorting);

    if (orders.count == 0) {
      throw this.errorService
        .get('order_not_found');
    }

    orders = await this.machineClientService
      .getClientInfo(orders);

    return orders;
  }

  async linkTracking(req) {
    this.validator.execute('machine-orders-link-tracking.json', req.body);

    let id = req.params.order_id;
    let tracking_code = req.body.tracking_code;
    let posted_at = req.body.posted_at;
    let user_id = req.body.user_id;

    let order = await this.machineOrdersRepository
      .getOrder(id);

    if (!order)
      throw this.errorService
        .get('order_not_found');

    if (!order.machine_order_shipping)
      throw this.errorService
        .get('order_shipping_null');

    let t;

    try {
      t = await this.transactionService.startTransaction();

      const data = {
        posted_at: posted_at
      };

      if (tracking_code) {
        data.tracking_code = tracking_code;
      }

      await this.machineOrdersRepository
        .updateShipping(order.machine_order_shipping_id, data, t);

      let bodyOrder = {
        status: 'done',
        concluded_by: user_id,
        concluded_at: new Date()
      };

      await this.machineOrdersRepository
        .updateOrder(order.id, bodyOrder, t);

      await this.transactionService.commitTransaction(t);
    } catch (e) {
      await this.transactionService.rollbackTransaction(t);
      throw e;
    }

  }

  async getOrder(req) {
    let id = req.params.order_id;

    if (!id)
      throw this.errorService
        .get('order_id_required');

    let order = await this.machineOrdersRepository
      .getOrder(id);

    if (!order)
      throw this.errorService
        .get('order_not_found');

    order = await this.machineClientService
      .getClientInfo(order);

    return order;
  }

  async getOrderByMachineId(req) {
    const machine_id = req.params.machine_id;

    let order = await this.machineOrdersRepository
      .getOrderByMachineId(machine_id);

    if (!order)
      throw this.errorService
        .get('order_not_found');

    order = await this.machineClientService
      .getClientInfo(order);

    return order;
  }

  async completeOrder(req) {
    this.validator.execute('machine-orders-link-client.json', req.body);

    let id = req.params.order_id;
    let shipping = req.body.machine_order_shipping ? req.body.machine_order_shipping : {};
    let products = req.body.machine_order_products;
    let order_shipping_settings = req.body.machine_order_shipping_settings;
    let user_id = req.body.user_id;
    let errors = [];
    let bodyProduct = {};
    let bodyMachine = {};

    let order = await this.machineOrdersRepository
      .getOrder(id);

    if (!order)
      throw this.errorService
        .get('order_not_found');

    if (order.machine_order_products.length != products.length)
      throw this.errorService
        .get('order_body_produts_length_mismatch');


    let tempCheckMachine = await this.machineOrdersService
      .checkIfDuplicateExists(products, 'machine_id');

    let tempCheckChip = await this.machineOrdersService
      .checkIfDuplicateExists(products, 'machine_chip_id');

    if (tempCheckMachine || tempCheckChip)
      throw this.errorService
        .get('req_body_with_the_duplicate_ids');

    errors = await this.machineOrdersService
      .checkMachineAndChipStatus(products);

    if (errors.length != 0)
      return errors;

    let package_value = order.machine_order_products
      .reduce((acc, product) => {
        let price = product.price ? product.price : 0;
        let discount = product.discount ? product.discount : 0;
        return acc + (price - discount);
      }, 0);

    if (!order_shipping_settings.company) {
      order_shipping_settings = {
        company: null,
        type_tracking_insertion: 'manual'
      };
    } else {
      const general_shipping_settings = await this.machineOrdersRepository
        .getMachineGeneralShippingSettings();

      order_shipping_settings = Object.assign(general_shipping_settings.toJSON(), order_shipping_settings);

      delete order_shipping_settings['id'];
      delete order_shipping_settings['pac_correios_client_service_id'];
      delete order_shipping_settings['sedex_correios_client_service_id'];
      delete order_shipping_settings['created_at'];
      delete order_shipping_settings['updated_at'];
    }

    if (this.machineOrdersService.hasPackageMeasures(shipping)) {
      const timeAndCost = await this.machineOrdersService
        .getTimeAndCost(
          shipping,
          package_value,
          order.machine_order_address.zipcode,
          order_shipping_settings,
          req.gis_log_id);

      if (timeAndCost) {
        shipping.shipment_price = timeAndCost.price;
        shipping.delivery_time = timeAndCost.delivery_time;
      }
    } else {
      order_shipping_settings.calc_time_and_cost = false;
      order_shipping_settings.type_tracking_insertion = 'manual';
    }

    shipping.company = order_shipping_settings.company;
    shipping.type_tracking_insertion = order_shipping_settings.type_tracking_insertion;

    let machine_order_shipping_id = order.machine_order_shipping_id;

    let t;

    try {
      t = await this.transactionService.startTransaction();

      if (!machine_order_shipping_id) {
        machine_order_shipping_id = await this.machineOrdersRepository
          .createShipping(shipping, t);
      } else {
        await this.machineOrdersRepository
          .updateShipping(machine_order_shipping_id, shipping, t);
      }

      for (let product of products) {
        await this.machineOrdersRepository
          .updateChip(product.machine_chip_id, t);

        const order_product = order.machine_order_products.find(p => p.id == product.id);

        bodyMachine = {
          machine_client_id: order.machine_client_id,
          machine_chip_id: product.machine_chip_id,
          status: 'inactived',
          business_type: order_product.acquisition_type
        };

        await this.machineOrdersRepository
          .updateMachine(product.machine_id, bodyMachine, t);

        let bodyLog = await this.machineOrdersService
          .formatLogObj(product.machine_id, order.machine_client_id, user_id, 'create');

        await this.machineOrdersRepository
          .createMachineLog(bodyLog, t);

        bodyProduct = {
          machine_id: product.machine_id
        };

        await this.machineOrdersRepository
          .updateProduct(product.id, bodyProduct, t);
      }

      const moss = await this.machineOrdersRepository
        .createMachineOrderShippingSettings(order_shipping_settings, { transaction: t });

      let bodyOrder = {
        status: 'awaiting_invoice',
        machine_order_shipping_id: machine_order_shipping_id.id,
        machine_order_shipping_setting_id: moss.id,
        linked_at: new Date(),
        linked_by: user_id
      };

      const quantity_coils = order.machine_order_products.reduce((prev, curr) => {
        return prev + curr.machine_model.quantity_coil;
      }, 0);

      if (quantity_coils > 0) {
        const coil_payload = {
          status: 'sent',
          amount: quantity_coils,
          origin: 'Gerencianet',
          description: 'Envio',
          machine_client_id: order.machine_client_id,
          user_id: user_id
        };

        await this.machineCoilStockRepository
          .create(coil_payload, t);

        await this.machineCoilStockRepository
          .updateStock(quantity_coils, 'sent', t);
      }

      await this.machineOrdersRepository
        .updateOrder(order.id, bodyOrder, t);

      await this.transactionService.commitTransaction(t);
    } catch (e) {
      await this.transactionService.rollbackTransaction(t);
      throw e;
    }

    return 200;
  }

  async closePlp(req) {
    let order = await this.machineOrdersRepository
      .getOrder(req.params.order_id);

    if (!order)
      throw this.errorService
        .get('order_not_found');

    if (!order.machine_order_shipping)
      throw this.errorService
        .get('order_shipping_null');

    if (order.machine_order_shipping.company.toUpperCase() != 'CORREIOS')
      throw this.errorService
        .get('company_must_be_correios');

    if (order.machine_order_shipping.type_tracking_insertion != 'automatic')
      throw this.errorService
        .get('type_tracking_insertion_must_be_automatic');

    if (order.machine_order_shipping.correios_label && order.machine_order_shipping.correios_label.correios_plp) {
      return {
        correios_plp: order.machine_order_shipping.correios_label.correios_plp
      };
    }

    order = await this.machineClientService
      .getClientInfo(order);

    let shipping_settings = order.machine_order_shipping_setting;

    if (!shipping_settings) {
      shipping_settings = await this.machineOrdersRepository
        .getMachineGeneralShippingSettings();
    }

    const correios_client_service = await this.correiosRepository
      .getCorreiosServiceByClientServiceId(shipping_settings.correios_client_service_id);

    if (!correios_client_service) {
      throw this.errorService
        .get('no_correios_client_service_were_found');
    }

    const is_correios_post_card_status_valid = await this.correiosService
      .checksStatusPostCard(
        correios_client_service.correios_client.post_card,
        req.gis_log_id
      );

    if (!is_correios_post_card_status_valid) {
      throw this.errorService
        .get('correios_post_card_status_is_invalid');
    }

    const is_correios_service_available = await this.correiosService
      .checkServiceAvailability(correios_client_service.correios_client.post_card, {
        service_code: correios_client_service.correios_service.code,
        zipcode_origin: shipping_settings.sender_zipcode,
        zipcode_destiny: order.machine_order_address.zipcode
      }, req.gis_log_id);

    if (!is_correios_service_available) {
      throw this.errorService
        .get('correios_service_is_unavailable');
    }

    const labels = await this.correiosService
      .requestLabels(correios_client_service.correios_client.post_card, {
        service_id: correios_client_service.correios_service.id_ect,
        amount_labels: 1
      }, req.gis_log_id);

    const check_digits = await this.correiosService
      .generateCheckDigitLabels(
        correios_client_service.correios_client.post_card,
        labels,
        req.gis_log_id
      );

    const t = await this.transactionService.startTransaction();
    try {
      const correios_plp = await this.correiosRepository
        .createCorreiosPlp({ correios_client_service_id: correios_client_service.id });

      const machine_invoice = order.machine_invoices[0];

      const aditional_services = [];

      if (shipping_settings.delivery_advicemment) {
        aditional_services.push('001');
      }

      if (shipping_settings.self_hand) {
        aditional_services.push('002');
      }

      if (shipping_settings.declared_value) {
        if (correios_client_service.correios_service.category == 'SEDEX') {
          aditional_services.push('019');
        } else {
          aditional_services.push('064');
        }
      }

      const plp_number = await this.correiosService.closePlpManyServices(correios_client_service.correios_client.post_card, {
        idPlpCliente: correios_plp.id,
        listaEtiquetas: [labels[0].replace(' ', '')],
        xml: {
          directorship_number: shipping_settings.correios_directorship_number,
          sender: {
            name: shipping_settings.sender_name,
            street: shipping_settings.sender_street,
            number: shipping_settings.sender_number,
            neighborhood: shipping_settings.sender_neighborhood,
            zipcode: shipping_settings.sender_zipcode,
            city: shipping_settings.sender_city,
            state: shipping_settings.sender_state,
            email: shipping_settings.sender_email
          },
          packages: [{
            label: labels[0].replace(' ', check_digits[0]),
            service_code: correios_client_service.correios_service.code,
            weight: order.machine_order_shipping.package_weight,
            invoice: machine_invoice.invoice,
            value: machine_invoice.value,
            height: order.machine_order_shipping.package_height,
            width: order.machine_order_shipping.package_width,
            length: order.machine_order_shipping.package_length,
            aditional_services: aditional_services,
            receiver: {
              name: order.machine_client.account.document.profile.name.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()),
              street: order.machine_order_address.street,
              number: order.machine_order_address.number,
              neighborhood: order.machine_order_address.neighborhood,
              city: order.machine_order_address.city,
              state: order.machine_order_address.state,
              zipcode: order.machine_order_address.zipcode
            }
          }]
        }
      }, req.gis_log_id);

      correios_plp.plp_number = plp_number;

      await this.correiosRepository
        .updateCorreiosPlp(correios_plp.id, { plp_number: plp_number }, t);

      const correios_label = await this.correiosRepository
        .createCorreiosLabel({
          label: labels[0],
          check_digit: check_digits[0],
          correios_client_service_id: correios_client_service.id,
          correios_plp_id: correios_plp.id
        }, t);

      await this.machineOrdersRepository
        .updateShipping(order.machine_order_shipping.id, {
          tracking_code: labels[0].replace(' ', check_digits[0]),
          correios_label_id: correios_label.id
        }, t);

      await this.transactionService.commitTransaction(t);

      return {
        correios_plp: correios_plp,
        tracking_code: labels[0].replace(' ', check_digits[0])
      };
    } catch (err) {
      await this.transactionService.rollbackTransaction(t);
      throw err;
    }
  }

  async getCorreiosLabel(req) {
    const payload = await this.machineOrdersService
      .getCorreiosGuidesConfig(req.params.order_id);

    return this.correiosGuidesService
      .generateLabel(payload);
  }

  async getCorreiosAr(req) {
    const payload = await this.machineOrdersService
      .getCorreiosGuidesConfig(req.params.order_id);

    return this.correiosGuidesService
      .generateAr(payload);
  }

  async getCorreiosPlp(req) {
    const payload = await this.machineOrdersService
      .getCorreiosGuidesConfig(req.params.order_id);

    return this.correiosGuidesService
      .generatePlp(payload);
  }


  async cancelOrder(req) {
    this.validator.execute('machine-orders-cancel.json', req.body);

    let order_id = req.params.order_id;
    let user_id = req.body.user_id;

    let order = await this.machineOrdersRepository
      .getOrder(order_id);

    if (!order)
      throw this.errorService
        .get('order_not_found');

    if (order.status == 'canceled')
      throw this.errorService
        .get('order_already_canceled');

    const t = await this.transactionService.startTransaction();
    try {

      await this.machineOrdersRepository
        .updateOrder(order.id, { status: 'canceled', canceled_by: user_id }, t);

      if (order.status != 'open') {

        let machines = order.machine_order_products
          .map(l => l.machine.id);

        let chips = order.machine_order_products
          .map(l => l.machine.machine_chip.id);

        let bodyMachine = {
          machine_chip_id: null,
          machine_client_id: null,
          status: 'in_stock'
        };

        await this.machineOrdersRepository
          .updateMachine(machines, bodyMachine, t, 'multiple');

        await this.machineOrdersRepository
          .updateChip(chips, t, 'multiple');

        const quantity_coils = order.machine_order_products.reduce((prev, curr) => {
          return prev + curr.machine_model.quantity_coil;
        }, 0);

        if (quantity_coils > 0) {
          const coil_payload = {
            status: 'received',
            amount: quantity_coils,
            origin: 'Gerencianet',
            description: 'Pedido cancelado',
            machine_client_id: null,
            user_id: user_id
          };

          await this.machineCoilStockRepository
            .create(coil_payload, false);

          await this.machineCoilStockRepository
            .updateStock(quantity_coils, 'canceled', false);
        }

        for (let product of order.machine_order_products) {
          let bodyLog = await this.machineOrdersService
            .formatLogObj(product.machine.id, order.machine_client_id, user_id, 'cancel');

          await this.machineOrdersRepository
            .createMachineLog(bodyLog, t);
        }
      }
      await this.transactionService.commitTransaction(t);

    } catch (err) {
      await this.transactionService.rollbackTransaction(t);
      throw err;
    }

  }


  async getMachineGeneralShippingSettings() {
    return this.machineOrdersRepository
      .getMachineGeneralShippingSettings();
  }

}

module.exports = MachineOrdersBs;
