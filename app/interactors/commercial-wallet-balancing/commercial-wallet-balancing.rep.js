'use strict';

class CommercialWalletBalancingRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async getCommercialWalletsWithoutAnalyst(limit, type) {
    const Op = this.db.Sequelize.Op;
    var options = {};

    options = {
      limit: limit,
      attributes: ['profile_id', 'document_id', 'commercial_size', 'is_special'],
      where: {
        commercial_size: {
          [Op.ne]: null
        },
        type: type,
        [Op.or]: [{
          responsible_analyst: null
        },
        {
          responsible_analyst: ''
        }
        ],

      },
      raw: true
    };

    return this.db.main
      .commercial_wallets
      .findAll(options);
  }

  async getCommercialAnalystsPermissions() {

    const options = {
      attributes: ['id', 'email', 'small', 'normal', 'larger', 'special_accounts'],

      order: [
        ['id', 'DESC']
      ],
      raw: true
    };

    return this.db.main
      .commercial_analysts
      .findAll(options);
  }

  async updateCommercialWalletAnalyst(document_id, analyst) {

    const values = {
      responsible_analyst: analyst,
    };
    const options = {
      where: {
        document_id: document_id
      },
      raw: true
    };

    return this.db.main
      .commercial_wallets
      .update(values, options);
  }

  async verifyAnalystByProfileId(profileId) {
    const Op = this.db.Sequelize.Op;

    const options = {
      attributes: ['responsible_analyst', 'profile_id'],
      where: {
        profile_id: profileId,
        [Op.and]: [{
          [Op.not]: {
            responsible_analyst: null
          }
        },
        {
          [Op.not]: {
            responsible_analyst: ''
          }
        }
        ]
      },
      order: [
        ['id', 'DESC']
      ],
      raw: true
    };

    return this.db.main
      .commercial_wallets
      .findAll(options);
  }

  async getTotalCommercialWalletsByAnalyst() {

    let sql = 'SELECT responsible_analyst, ' +
      'SUM(commercial_size="small") AS small, ' +
      'SUM(commercial_size="normal") AS normal, ' +
      'SUM(commercial_size="larger") AS larger, ' +
      'SUM(is_special = "1") AS is_special, ' +
      'COUNT(commercial_size) AS total_wallets ' +
      'FROM commercial_wallets ' +
      'WHERE responsible_analyst IS NOT NULL and responsible_analyst != "" ' +
      'GROUP BY responsible_analyst;';

    let result = await this.db.main.sequelize.query(sql, {
      type: this.db.Sequelize.QueryTypes.SELECT,
      raw: true
    });

    return result;
  }
}

module.exports = CommercialWalletBalancingRepository;
