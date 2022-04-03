'use strict';
class rateNegotiationsRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async createNegotiationRates(negotiationRate) {

    return this.db.main
      .rate_negotiations
      .create(negotiationRate);
  }
  async createNegotiationRateBillets(negotiationRate) {

    return this.db.main
      .rate_negotiation_billets
      .create(negotiationRate);
  }
  async createNegotiationRateCards(negotiationRate) {

    return this.db.main
      .rate_negotiation_cards
      .create(negotiationRate);
  }
  async createNegotiationPix(negotiationRate) {

    return this.db.main
      .rate_negotiation_pix
      .create(negotiationRate);
  }
  async createNegotiationBankings(negotiationRate) {

    return this.db.main
      .rate_negotiation_bankings
      .create(negotiationRate);
  }

  async getRateNegotiation(id) {
    const options = {
      where: {
        id: id
      },
      raw: true,
    };

    return this.db.main
      .rate_negotiations
      .findOne(options);
  }

  async getNegotiationsBillets(id) {

    const options = {
      where: {
        id: id
      },
      raw: true
    };

    return this.db.main
      .rate_negotiation_billets
      .findOne(options);
  }

  async getNegotiationsCards(id) {

    const options = {
      where: {
        id: id
      },
      raw: true,
    };

    return this.db.main
      .rate_negotiation_cards
      .findOne(options);
  }

  async getNegotiationsPix(id) {

    const options = {
      where: {
        id: id
      },
      raw: true,
    };

    return this.db.main
      .rate_negotiation_pix
      .findOne(options);
  }

  async getNegotiationsBankings(id) {

    const options = {
      where: {
        id: id
      },
      raw: true,
    };

    return this.db.main
      .rate_negotiation_bankings
      .findOne(options);
  }

  async updateNegotiations(id, status_id) {
    const options = {
      where: {
        id: id,
      }
    };
    const update = {
      rate_negotiation_status_id: status_id
    };
    return this.db.main
      .rate_negotiations
      .update(update, options);
  }

  async updateNegotiationsBillets(id, updatedRateNegotiationBillets) {
    const options = {
      where: {
        id: id,
      },
    };

    return this.db.main
      .rate_negotiation_billets
      .update(updatedRateNegotiationBillets, options);
  }

  async updateNegotiationsCards(id, updatedRateNegotiationCards) {
    const options = {
      where: {
        id: id,
      },
    };

    return this.db.main
      .rate_negotiation_cards
      .update(updatedRateNegotiationCards, options);
  }

  async updateNegotiationsPix(id, updatedRateNegotiationPix) {
    const options = {
      where: {
        id: id,
      }
    };

    return this.db.main
      .rate_negotiation_pix
      .update(updatedRateNegotiationPix, options);
  }

  async updateNegotiationsBankings(id, updatedRateNegotiationBankings) {
    const options = {
      where: {
        id: id,
      }
    };

    return this.db.main
      .rate_negotiation_bankings
      .update(updatedRateNegotiationBankings, options);
  }

  async createRateNegotiationHistory(id, type, status, user_id, data_alter, analyst_rate = null) {

    let negotiation = {
      rate_negotiation_config_status_id: status,
      user_id: user_id,
      data_alter: data_alter,
      analyst_rate: JSON.stringify(analyst_rate)
    };

    switch (type) {
      case 'billets':
        negotiation.rate_negotiation_billets_id = id;
        break;
      case 'cards':
        negotiation.rate_negotiation_cards_id = id;
        break;
      case 'pix':
        negotiation.rate_negotiation_pix_id = id;
        break;
      case 'bankings':
        negotiation.rate_negotiation_bankings_id = id;
        break;
    }
    return this.db.main
      .rate_negotiation_histories
      .create(negotiation);

  }

  async getAnyPendingNegotiation(id) {
    const Op = this.db.Sequelize.Op;

    const options = {
      attributes: [
        [this.db.Sequelize.fn('COUNT', this.db.Sequelize.col('id')), 'count']
      ],
      where: {
        rate_negotiations_id: id,
        rate_negotiation_config_status_id: {
          [Op.in]: [3, 4]
        }
      },
      raw: true
    };

    let billets = await this.db.main
      .rate_negotiation_billets
      .findAll(options);

    let cards = await this.db.main
      .rate_negotiation_cards
      .findAll(options);

    let pix = await this.db.main
      .rate_negotiation_pix
      .findAll(options);

    let bankings = await this.db.main
      .rate_negotiation_bankings
      .findAll(options);

    return billets[0].count + cards[0].count + pix[0].count + bankings[0].count;
  }

  async getRateNegotiationsToAssign(limit, userIdsComercialAnalysts) {
    const Op = this.db.Sequelize.Op;

    const options = {
      where: {
        rate_negotiation_status_id: 1,
        user_id: {
          [Op.notIn]: userIdsComercialAnalysts
        }
      },
      limit: limit,
      order: [
        ['id', 'ASC']
      ],
      raw: true
    };

    return this.db.main
      .rate_negotiations
      .findAll(options);
  }

  async updateResponsabilities(id, responsible_user_id, assigned_responsible_at) {

    const options = {
      where: {
        id: id,
      }
    };
    const update = {
      rate_negotiation_status_id: 2,
      responsible_user_id: responsible_user_id,
      assigned_responsible_at: assigned_responsible_at
    };
    return this.db.main
      .rate_negotiations
      .update(update, options);
  }

  async getRatesNegotiationFromConfigs(responsible_user_id, status, pagination, term, order) {
    let query = 'SELECT temp.*, rns.title AS status FROM ' +
      ' (SELECT rn.* FROM gis.rate_negotiations rn ' +
      ' JOIN gis.rate_negotiation_billets rnbi ON rn.id = rnbi.rate_negotiations_id ' +
      ' AND rnbi.rate_negotiation_config_status_id IN (:status) UNION ' +
      ' SELECT rn.* FROM gis.rate_negotiations rn ' +
      ' JOIN gis.rate_negotiation_bankings rnba ON rn.id = rnba.rate_negotiations_id ' +
      ' AND rnba.rate_negotiation_config_status_id IN (:status) UNION ' +
      ' SELECT rn.* FROM gis.rate_negotiations rn ' +
      ' JOIN gis.rate_negotiation_cards rnca ON rn.id = rnca.rate_negotiations_id ' +
      ' AND rnca.rate_negotiation_config_status_id IN (:status) UNION' +
      ' SELECT rn.* FROM gis.rate_negotiations rn ' +
      ' JOIN gis.rate_negotiation_pix rnp ON rn.id = rnp.rate_negotiations_id' +
      ' AND rnp.rate_negotiation_config_status_id IN (:status)) AS temp ' +
      ' JOIN gis.rate_negotiation_status rns ' +
      ' ON temp.rate_negotiation_status_id = rns.id ' +
      ' JOIN gis.rate_negotiation_reasons rnr ' +
      ' ON temp.rate_negotiation_reasons_id = rnr.id ';

    if (!status.includes(4))
      query += ' WHERE (temp.responsible_user_id = :responsible_user_id OR temp.user_id = :responsible_user_id)';
    else
      query += ' WHERE temp.responsible_user_id = :responsible_user_id';

    if (term) {
      if (RegExp('^[0-9]*$').test(term)) {
        query += ' AND temp.document = :term';
      } else {
        query += ' AND temp.name LIKE "%' + term + '%"';
      }
    }

    query += ` ORDER BY id ${order == 'ASC' ? 'ASC' : 'DESC'}` +
      ' LIMIT :offset, :limit; ';

    return await this.db.main.rate_negotiations.sequelize.query(query, {
      type: this.db.main.rate_negotiations.sequelize.QueryTypes.SELECT,
      logging: true,
      replacements: {
        status: status,
        responsible_user_id: responsible_user_id,
        term: term,
        offset: pagination.offset,
        limit: pagination.limit,

      }
    });
  }


  async countRatesNegotiationFromConfigs(responsible_user_id, status, term) {

    let query = 'SELECT COUNT(temp.id) AS total_rows, temp.*, rns.title AS status FROM ' +
      ' (SELECT rn.* FROM gis.rate_negotiations rn ' +
      ' JOIN gis.rate_negotiation_billets rnbi ON rn.id = rnbi.rate_negotiations_id ' +
      ' AND rnbi.rate_negotiation_config_status_id IN (:status) UNION ' +
      ' SELECT rn.* FROM gis.rate_negotiations rn ' +
      ' JOIN gis.rate_negotiation_bankings rnba ON rn.id = rnba.rate_negotiations_id ' +
      ' AND rnba.rate_negotiation_config_status_id IN (:status) UNION ' +
      ' SELECT rn.* FROM gis.rate_negotiations rn ' +
      ' JOIN gis.rate_negotiation_cards rnca ON rn.id = rnca.rate_negotiations_id ' +
      ' AND rnca.rate_negotiation_config_status_id IN (:status) UNION ' +
      ' SELECT rn.* FROM gis.rate_negotiations rn ' +
      ' JOIN gis.rate_negotiation_pix rnp ON rn.id = rnp.rate_negotiations_id' +
      ' AND rnp.rate_negotiation_config_status_id IN (:status)) AS temp ' +
      ' JOIN gis.rate_negotiation_status rns ' +
      ' ON temp.rate_negotiation_status_id = rns.id ' +
      ' WHERE temp.responsible_user_id = :responsible_user_id ';

    if (term) {
      if (RegExp('^[0-9]*$').test(term)) {
        query += ' AND temp.document = :term';
      } else {
        query += ' AND temp.name LIKE "%' + term + '%"';
      }
    }

    query += ' ORDER BY id';


    return await this.db.main.rate_negotiations.sequelize.query(query, {
      type: this.db.main.rate_negotiations.sequelize.QueryTypes.SELECT,
      logging: true,
      replacements: {
        status: status,
        responsible_user_id: responsible_user_id,
        term: term,
      }
    });
  }

  async countRateNegotiationsFromAccount(account_id) {
    const options = {
      attributes: [
        [this.db.Sequelize.fn('COUNT', this.db.Sequelize.col('id')), 'total']
      ],
      where: {
        account_id: account_id
      },
      raw: true
    };

    return this.db.main
      .rate_negotiations
      .findOne(options);
  }

  async getRatesNegotiationBillets(id, status) {
    const Op = this.db.Sequelize.Op;
    const options = {
      where: {
        rate_negotiations_id: id,
      },
      include: [{
        model: this.db.main.rate_negotiation_config_status,
        attributes: ['title'],
        required: true,
      }],
      nest: true,
      raw: true
    };

    if (status) {
      if (Array.isArray(status))
        options.where.rate_negotiation_config_status_id = {
          [Op.in]: status
        };
      else
        options.where.rate_negotiation_config_status_id = status;
    }

    return this.db.main
      .rate_negotiation_billets
      .findOne(options);
  }

  async getRatesNegotiationCards(id, status) {
    const Op = this.db.Sequelize.Op;
    const options = {
      where: {
        rate_negotiations_id: id,
      },
      include: [{
        model: this.db.main.rate_negotiation_config_status,
        attributes: ['title'],
        required: true,
      }],
      nest: true,
      raw: true
    };

    if (status) {
      if (Array.isArray(status))
        options.where.rate_negotiation_config_status_id = {
          [Op.in]: status
        };
      else
        options.where.rate_negotiation_config_status_id = status;
    }

    return this.db.main
      .rate_negotiation_cards
      .findOne(options);
  }

  async getRatesNegotiationPix(id, status) {
    const Op = this.db.Sequelize.Op;
    const options = {
      where: {
        rate_negotiations_id: id,
      },
      include: [{
        model: this.db.main.rate_negotiation_config_status,
        attributes: ['title'],
        required: true,
      }],
      nest: true,
      raw: true
    };

    if (status) {
      if (Array.isArray(status))
        options.where.rate_negotiation_config_status_id = {
          [Op.in]: status
        };
      else
        options.where.rate_negotiation_config_status_id = status;
    }

    return this.db.main
      .rate_negotiation_pix
      .findOne(options);
  }

  async getRatesNegotiationBankings(id, status) {
    const Op = this.db.Sequelize.Op;
    const options = {
      where: {
        rate_negotiations_id: id,
      },
      include: [{
        model: this.db.main.rate_negotiation_config_status,
        attributes: ['title'],
        required: true,
      },
      {
        model: this.db.main.rate_negotiation_types,
        attributes: ['title'],
        required: true,
      }
      ],
      nest: true,
      raw: true
    };

    if (status) {
      if (Array.isArray(status))
        options.where.rate_negotiation_config_status_id = {
          [Op.in]: status
        };
      else
        options.where.rate_negotiation_config_status_id = status;
    }

    return this.db.main
      .rate_negotiation_bankings
      .findAll(options);
  }

  async historyList(id, type, pagination) {

    const options = {
      where: {},
      include: [{
        model: this.db.main.rate_negotiation_config_status,
        attributes: ['id', 'title'],
        required: true
      }],
      order: [
        ['updated_at', pagination.order]
      ],
      raw: true,
      nest: true,
      offset: pagination.offset,
      limit: pagination.limit
    };

    switch (type) {
      case 'billets':
        options.where.rate_negotiation_billets_id = id;
        break;
      case 'cards':
        options.where.rate_negotiation_cards_id = id;
        break;
      case 'bankings':
        options.where.rate_negotiation_bankings_id = id;
        break;
      case 'pix':
        options.where.rate_negotiation_pix_id = id;
        break;
    }
    return this.db.main
      .rate_negotiation_histories
      .findAll(options);
  }

  async getRateNegotiationsLast10Months(account_id, months) {
    const Op = this.db.Sequelize.Op;
    let date = new Date();
    date.setMonth(date.getMonth() - months);
    const options = {
      where: {
        account_id: account_id,
        created_at: {
          [Op.gte]: date
        }
      },
      raw: true
    };

    return this.db.main
      .rate_negotiations
      .findAll(options);
  }

  async reasonsList() {

    const options = {
      raw: true
    };

    return this.db.main
      .rate_negotiation_reasons
      .findAll(options);
  }

  async get(id) {

    const options = {
      where: {
        id: id
      },
      include: [{
        model: this.db.main.rate_negotiation_billets,
        required: false,
        as: 'rate_negotiation_billets'
      },
      {
        model: this.db.main.rate_negotiation_cards,
        required: false,
        as: 'rate_negotiation_cards'
      },
      {
        model: this.db.main.rate_negotiation_pix,
        required: false,
        as: 'rate_negotiation_pix'
      }
      ],
      raw: true,
      nest: true
    };

    return this.db.main
      .rate_negotiations
      .findOne(options);
  }

  async getCommercialAnalysts(user_id) {

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
          id: {
            [Op.ne]: user_id
          }
        }
      }],
      order: [
        ['id', 'DESC']
      ],
      raw: true
    };

    return this.db.intranet
      .commercial_analyst
      .findAll(options);
  }

  async getCountRateNegotiationsToAssign(userIdsComercialAnalysts) {
    const Op = this.db.Sequelize.Op;

    const options = {
      where: {
        rate_negotiation_status_id: 1,
        user_id: {
          [Op.notIn]: userIdsComercialAnalysts
        }
      },
      order: [
        ['id', 'ASC']
      ],
      raw: true
    };

    return this.db.main
      .rate_negotiations
      .findAndCountAll(options);
  }
  async createRateNegotiationLog(rate_negotiations_id, executer_id, user_id) {
    let log = {
      rate_negotiations_id: rate_negotiations_id,
      executer_id: executer_id,
      user_id: user_id
    };
    return this.db.main
      .rate_negotiation_logs
      .create(log);
  }
}
module.exports = rateNegotiationsRepository;
