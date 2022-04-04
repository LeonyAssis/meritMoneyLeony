'use strict';
class CommercialWalletRepository {
  constructor(params) {
    this.db = params.sequelize;
    this.config = params.config;
    this.rp = params.requestPromise;
  }

  async get(document) {
    const options = {
      attributes: ['id', 'type', 'responsible_analyst', 'reference_value', 'commercial_size', 'start_date', 'end_date', 'updated_commercial_size_at', 'is_special', 'created_at'],
      include: [{
        model: this.db.main.commercial_analysts,
        attributes: ['id', 'name', 'email'],
        required: false
      }],
      where: {
        document: document
      },
      order: [
        ['updated_at', 'DESC']
      ],
      raw: false,
      limit: 1
    };

    return this.db.main
      .commercial_wallets
      .findAll(options);
  }


  async get_by_id(id) {
    const options = {
      where: {
        id: id
      },
      raw: true
    };
    return this.db.main
      .commercial_wallets
      .findOne(options);
  }

  async create(data) {
    return this.db.main
      .commercial_wallets
      .create(data);
  }

  async createHeroku(data) {
  // console.log(this.db.main.sequelize.users);
    return this.db.main
      .users
      .create(data);
  }

  async update(filter, data, t) {
    const options = {
      where: filter,
      transaction: t
    };
    return this.db.main
      .commercial_wallets
      .update(data, options);
  }

  async getAnalystByEmail(email) {

    const Op = this.db.Sequelize.Op;

    const options = {
      attributes: ['user_id'],
      where: {
        [Op.and]: [{
          master: 0
        },
        {
          assignment: 1
        }
        ]
      },
      include: [{
        model: this.db.intranet.user,
        attributes: ['email'],
        required: true,
        where: {
          roles_mask: {
            [Op.ne]: 2
          },
          email: email
        }
      }],
      order: [
        ['id', 'DESC']
      ],
      raw: true
    };

    return this.db.intranet
      .commercial_analyst
      .findOne(options);
  }

  async documentCommercialSizeIntranet(document_id, profile_id, commercial_size) {

    const uri = `${this.config.intranet.url}/ws/document_size/update_or_create_document_size`;
    const options = {
      method: 'POST',
      uri: uri,
      body: {
        document: {
          document_id: document_id,
          profile_id: profile_id,
          commercial_size: commercial_size
        }
      },
      json: true
    };
    try {
      let resp = await this.rp(options);
      return resp;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = CommercialWalletRepository;
