class CorreiosRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async getClientByPostCard(post_card) {
    return this.db.main.correios_clients
      .findOne({
        attributes: ['id', 'post_card', 'contract', 'administrative_code', 'cnpj'],
        where: {
          post_card: post_card
        },
        raw: true
      });
  }

  async insertCorreiosClient(data) {
    return this.db.main
      .correios_clients
      .create(data);
  }

  async getCorreiosServicesByIdEct(id_ect) {
    return this.db.main.correios_services
      .findOne({
        attributes: ['id', 'id_ect', 'code', 'description', 'category'],
        where: {
          id_ect: id_ect
        },
        raw: true
      });
  }

  async insertCorreiosService(data) {
    return this.db.main
      .correios_services
      .create(data);
  }

  async createRelationshipServiceClient(clientId, serviceId) {
    let data = {
      correios_client_id: clientId,
      correios_service_id: serviceId
    };
    return this.db.main
      .correios_client_services
      .create(data);
  }

  async updateCorreiosServicesByIdEct(id_ect, data) {
    const options = {
      where: {
        id_ect: id_ect,
      }
    };
    const update = data;
    return this.db.main
      .correios_services
      .update(update, options);
  }

  async getCorreiosServicesClients(correios_client_id, correios_service_id) {
    return this.db.main.correios_client_services
      .findOne({
        where: {
          correios_client_id: correios_client_id,
          correios_service_id: correios_service_id
        },
        raw: true
      });
  }

  async getCorreiosServiceByClientServiceId(correios_client_service_id) {
    return this.db.main.correios_client_services
      .findOne({
        include: [{
          model: this.db.main.correios_services,
          required: true
        }, {
          model: this.db.main.correios_clients,
          required: true
        }],
        where: {
          id: correios_client_service_id
        },
        nest: true,
        raw: true
      });
  }

  async createCorreiosPlp(payload, t) {
    const options = {};

    if (t) {
      options['transaction'] = t;
    }

    return this.db.main.correios_plp
      .create(payload, options);
  }

  async updateCorreiosPlp(id, payload, t) {
    const options = {
      where: {
        id: id
      }
    };

    if (t) {
      options['transaction'] = t;
    }

    return this.db.main.correios_plp
      .update(payload, options);
  }

  async createCorreiosLabel(payload, t) {
    const options = {};

    if (t) {
      options['transaction'] = t;
    }

    return this.db.main.correios_labels
      .create(payload, options);
  }

  async createCorreiosRequestLog(payload) {
    return this.db.main.correios_request_logs
      .create(payload);
  }

}

module.exports = CorreiosRepository;
