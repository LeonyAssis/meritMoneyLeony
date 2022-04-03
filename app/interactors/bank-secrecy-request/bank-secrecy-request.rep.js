'use strict';

class BankSecrecyRequestRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async create(data, statement_request_id) {
    data.statement_request_id = statement_request_id;
    return this.db.main
      .bank_secrecy_requests
      .create(data);
  }

  async get(id) {

    let options = {
      where: {
        id: id
      },
      raw: true
    };

    return this.db.main
      .bank_secrecy_requests
      .findOne(options);
  }

  async update(data, id) {
    let options = {
      where: {
        id: id
      },
      raw: true
    };

    return this.db.main
      .bank_secrecy_requests
      .update(data, options);
  }

  async list(term, pagination) {
    const Op = this.db.Sequelize.Op;
    let options = {
      order: [
        ['id', pagination.order]
      ],
      raw: true,
      offset: pagination.offset,
      limit: pagination.limit
    };

    if (term)
      options.where = {
        [Op.or]: [{
            document: term
          },
          {
            control_number: term
          }
        ]
      };

    return this.db.main
      .bank_secrecy_requests
      .findAll(options);
  }

  async count(term) {
    const Op = this.db.Sequelize.Op;
    let options = {
      raw: true
    };

    if (term)
      options.where = {
        [Op.or]: [{
            document: term
          },
          {
            control_number: term
          }
        ]
      };

    return this.db.main
      .bank_secrecy_requests
      .count(options);
  }
}

module.exports = BankSecrecyRequestRepository;
