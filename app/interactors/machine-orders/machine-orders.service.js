class MachineOrdersService {

  constructor(params) {
    this.config = params;
    this.errorService = params.errorService;
    this.db = params.sequelize;
    this.machineOrdersRepository = params.machineOrdersRepository;
    this.isEmpty = require('lodash/isEmpty');
    this.shippingService = params.shippingService;
    this.correiosRepository = params.correiosRepository;
    this.correiosService = params.correiosService;
    this.machineClientService = params.machineClientService;
  }

  async getParametersList(query) {
    const Op = this.db.Sequelize.Op;
    let limit = parseInt(query.limit) || 10;
    let offset = ((parseInt(query.page) || 1) - 1) * limit;
    let search = query.search;
    let startDate = query.start_date;
    let endDate = query.end_date;
    let status = query.status || 'open';
    let column = query.column;
    let order = query.order;

    let parameters = {
      limit: limit,
      offset: offset
    };

    let filtersMachineClient = {};
    let filtersOrders = {};

    let sorting = [
      ['updated_at', 'desc']
    ];

    if (['id', 'created_at', 'status'].includes(column)) {
      sorting = [
        ['updated_at', 'desc'],
        [column, order == 'asc' ? 'asc' : 'desc']
      ];
    }

    let ids;
    if (search && Number.isInteger(parseInt(search))) {
      ids = await this.machineOrdersRepository
        .getAccountsIdsByQueryCpfOrCnpj(search);

    } else if (search) {
      ids = await this.machineOrdersRepository
        .getAccountsIdsByQueryName(search);

    } else {
      ids = null;
    }

    if (ids != null) {
      filtersMachineClient['account_id'] = {
        [Op.in]: ids
      };
    }

    let statusTemp = [];
    statusTemp = status.split(',');
    let statusQueryFilter = statusTemp.filter(el => el != '');

    if (statusQueryFilter.length > 1) {
      filtersOrders['status'] = {
        [Op.in]: statusQueryFilter
      };
    } else {
      filtersOrders['status'] = statusQueryFilter[0];
    }

    if (startDate && endDate) {
      filtersOrders['created_at'] = {
        [Op.between]: [`${startDate} 00:00:00`, `${endDate} 23:59:59`]
      };
    } else if (startDate) {
      filtersOrders['created_at'] = {
        [Op.gte]: `${startDate} 00:00:00`
      };
    } else if (endDate) {
      filtersOrders['created_at'] = {
        [Op.lte]: `${endDate} 23:59:59`
      };
    }

    return { parameters, filtersMachineClient, filtersOrders, sorting };
  }

  async checkMachineAndChipStatus(products) {
    let errors = [];
    let objTemp = {};

    for (let product of products) {

      let machineTemp = await this.machineOrdersRepository
        .checkMachineStatus(product.machine_id);

      let chipTemp = await this.machineOrdersRepository
        .checkChipStatus(product.machine_chip_id);

      if (!machineTemp || machineTemp.status != 'in_stock')
        objTemp.machine = true;

      if (!chipTemp || chipTemp.status != 'available')
        objTemp.chip = true;

      if (!this.isEmpty(objTemp)) {
        product.errors = objTemp;
        errors.push(product);
        // @ts-ignore
        objTemp = {};
      }
    }

    return errors;
  }

  async checkIfDuplicateExists(array, item) {
    let temp = array.map(i => i[item]);
    return new Set(temp).size !== temp.length;
  }

  async getTimeAndCost(shipping, package_value, destiny_zipcode, shippingSettings, gis_log_id) {
    if (shippingSettings.calc_time_and_cost) {
      let post_card = null;
      let service = null;

      if (shippingSettings.company.toUpperCase() == 'CORREIOS') {
        const correiosClientService = await this.correiosRepository
          .getCorreiosServiceByClientServiceId(shippingSettings.correios_client_service_id);

        if (!correiosClientService) {
          throw this.errorService
            .get('no_correios_client_service_were_found');
        }

        post_card = correiosClientService.correios_client.post_card;
        service = correiosClientService.correios_service.code;

        const is_correios_service_available = await this.correiosService
          .checkServiceAvailability(post_card, {
            service_code: service,
            zipcode_origin: shippingSettings.sender_zipcode,
            zipcode_destiny: destiny_zipcode
          }, gis_log_id);

        if (!is_correios_service_available) {
          throw this.errorService
            .get('correios_service_is_unavailable');
        }
      }

      const timeAndCost = await this.shippingService
        .getTimeAndCost({
          package_width: shipping.package_width,
          package_height: shipping.package_height,
          package_length: shipping.package_length,
          package_weight: shipping.package_weight,
          package_value: package_value,
          company: shippingSettings.company,
          origin: shippingSettings.sender_zipcode,
          destiny: destiny_zipcode,
          format: 'CAIXAPACOTE',
          service: service,
          post_card: post_card,
          self_hand: shippingSettings.self_hand,
          delivery_advicemment: shippingSettings.delivery_advicemment
        }, gis_log_id);

      return timeAndCost;
    }

    return null;
  }

  async getCorreiosGuidesConfig(order_id) {
    let order = await this.machineOrdersRepository
      .getOrder(order_id);

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

    if (!order.machine_order_shipping.correios_label)
      throw this.errorService
        .get('machine_order_shipping_does_not_have_correios_label');

    if (!order.machine_order_shipping.correios_label.correios_plp)
      throw this.errorService
        .get('correios_label_does_not_have_correios_plp');

    order = await this.machineClientService
      .getClientInfo(order);

    let shipping_settings = order.machine_order_shipping_setting;

    if (!shipping_settings) {
      shipping_settings = await this.machineOrdersRepository
        .getMachineGeneralShippingSettings();
    }

    const correios_client_service = await this.correiosRepository
      .getCorreiosServiceByClientServiceId(order.machine_order_shipping.correios_label.correios_client_service_id);

    if (!correios_client_service) {
      throw this.errorService
        .get('no_correios_client_service_were_found');
    }

    const machine_invoice = order.machine_invoices[0];

    return {
      // Label informations
      label: {
        plpNumber: order.machine_order_shipping.correios_label.correios_plp.plp_number,
        plpClosedAt: order.machine_order_shipping.correios_label.created_at,
        orderId: order.id,
        trackNumber: order.machine_order_shipping.tracking_code,     // Código da etiqueta completo
        postCard: correios_client_service.correios_client.post_card,           // Seu código de cartão de postagem dos correios
        serviceCode: correios_client_service.correios_service.code,             // Código do serviço dos correios (consultar o manual do SIGEP)
        serviceName: this.correiosService.getServiceNameFormated(correios_client_service.correios_service.description),             // SEDEX, SEDEX 10, SEDEX 12, SEDEX HOJE, PAC ou CARTA
        serviceNameComplete: correios_client_service.correios_service.description,
        weight: order.machine_order_shipping.package_weight,                      // Peso do pacote, opcional
        contract: correios_client_service.correios_client.contract,           // Número do contrato com o cliente, opcional
        invoice: machine_invoice.invoice,                 // Número da nota fiscal, opcional
        invoiceValue: machine_invoice.value,           // Valor da nota fiscal, opcional
        remarks: '',                      // Observações, opcional
        services: {
          inHands: shipping_settings.self_hand,                  // Mãos Próprias, opcional, serviço 002 - MP
          receiptNotice: shipping_settings.delivery_advicemment,           // Aviso de Recebimento, opcional, serviço 001 - AR
          declaredValue: shipping_settings.declared_value,            // Valor declarado nacional, serviço 019 - VD
          neighborDelivery: false,        // Entrega no vizinho, opcional, serviço 011 - EV
          largeFormats: false,            // Grandes Formatos, opcional, serviço 057 - GF
        },
        sender: {                         // Dados do remetente
          name: shipping_settings.sender_name,
          address: shipping_settings.sender_street,
          addressNumber: shipping_settings.sender_number,
          complement: null,
          neighborhood: shipping_settings.sender_neighborhood,
          city: shipping_settings.sender_city,
          state: shipping_settings.sender_state,
          zipCode: shipping_settings.sender_zipcode,
          phone: shipping_settings.sender_phone,
        },
        recipient: {                      // Dados do destinatário
          name: order.machine_client.account.document.profile.name.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()),
          // careOf: 'Sra. Fulana de Tal',
          address: order.machine_order_address.street,
          addressNumber: order.machine_order_address.number,
          complement: order.machine_order_address.reference,
          neighborhood: order.machine_order_address.neighborhood,
          city: order.machine_order_address.city,
          state: order.machine_order_address.state,
          zipCode: order.machine_order_address.zipcode,
          phone: order.machine_client.account.document.profile.cellphone
        },
      },
    };
  }

  async formatLogObj(machine_id, client_id, user_id, type) {
    let body;
    if (type == 'create') {
      body = {
        machine_id,
        current_client_id: client_id,
        status: 'inactived',
        description: 'The order has been linked and the machine is separated',
        user_id
      };
    }
    else {
      body = {
        machine_id,
        current_client_id: null,
        status: 'in_stock',
        description: 'The order has been canceled',
        user_id
      };
    }

    return body;
  }

  async hasPackageMeasures(shipping) {
    const { package_width, package_height, package_length, package_weight } = shipping;
    return package_width && package_height && package_length && package_weight;
  }

}

module.exports = MachineOrdersService;
