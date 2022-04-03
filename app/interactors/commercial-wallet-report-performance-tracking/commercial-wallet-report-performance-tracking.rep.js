'use strict';
class CommercialWalletReportPerformanceTrackingRepository {

  constructor(params) {
    this.db = params.sequelize;
    this.config = params.config;
    this.momentTz = params.momentTz;
    this.moment = params.moment;
  }

  async getCommercialWalletFromDateEnd(date_end, last_perfomance_tracking, limit, type) {
    const Op = this.db.Sequelize.Op;

    const options = {
      attributes: ['id', 'profile_id', 'document_id', 'document', 'type', 'reference_value', 'responsible_analyst', 'start_date', 'end_date', 'created_at', 'updated_at'],
      where: {
        end_date: {
          [Op.gt]: date_end
        },
        type: type,
      },

      raw: true,
      limit: limit,
      order: [
        ['id', 'ASC']
      ],
    };

    if (last_perfomance_tracking) {
      if (Object.prototype.hasOwnProperty.call(last_perfomance_tracking, 'commercial_wallet_id')) {
        options.where.id = {
          [Op.gt]: last_perfomance_tracking.commercial_wallet_id
        };
      }
    }

    return this.db.main
      .commercial_wallets
      .findAll(options);
  }

  async getCommercialWalletToProcess(date_end, reference_date, limit, type) {

    let query = 'SELECT * FROM gis.commercial_wallets cw ' +
      ' WHERE cw.end_date > "' + this.moment(date_end).format('YYYY-MM-DD') + '" ' +
      ' AND cw.type = :type ' +
      ' AND NOT EXISTS ( ' +
      ' SELECT * FROM gis.commercial_wallet_performance_tracking cwp ' +
      ' WHERE cw.id = cwp.commercial_wallet_id ' +
      ' AND cwp.reference_date = "' + this.moment(reference_date).format('YYYY-MM-DD') + '") ' +
      ' LIMIT :limit; ';

    return await this.db.main.commercial_wallets.sequelize.query(query, {
      type: this.db.main.commercial_wallets.sequelize.QueryTypes.SELECT,
      replacements: {
        type: type,
        limit: limit,
      }
    });
  }

  async getLastPerformanceTrackingFromReferenceDate(reference_date, type) {
    const Op = this.db.Sequelize.Op;
    const options = {
      attributes: ['commercial_wallet_id'],
      where: {
        reference_date: {
          [Op.gte]: reference_date
        }
      },
      include: [{
        model: this.db.main.commercial_wallets,
        attributes: ['type'],
        required: true,
        where: {
          type: type
        }
      }],
      order: [
        ['commercial_wallet_id', 'DESC']
      ],

      raw: true
    };

    return this.db.main
      .commercial_wallet_performance_tracking
      .findOne(options);
  }

  async getCommercialWalletFromAnalyst(analyst, date_end) {
    const Op = this.db.Sequelize.Op;

    const options = {
      attributes: ['id', 'profile_id', 'document_id', 'document', 'type', 'reference_value', 'responsible_analyst', 'start_date', 'end_date', 'created_at', 'updated_at'],
      where: {
        end_date: {
          [Op.gt]: date_end
        },
        responsible_analyst: analyst
      },

      raw: true
    };

    return this.db.main
      .commercial_wallets
      .findAll(options);
  }

  async getPerformanceTrackingMonth(commercial_wallet_id, reference_date) {
    const Op = this.db.Sequelize.Op;
    let start_date = new Date(reference_date);
    let date_end = new Date(reference_date);
    date_end.setMonth(reference_date.getMonth() + 1);

    const options = {
      where: {
        commercial_wallet_id: commercial_wallet_id,
        reference_date: {
          [Op.gte]: start_date,
          [Op.lt]: date_end
        },
      },

      raw: true
    };

    return this.db.main
      .commercial_wallet_performance_tracking
      .findOne(options);

  }

  async getTransactionsFromDocument(document, start_date, end_date) {

    let sql = 'SELECT d.documento, to_char(m.data, \'MM/YYYY\') as data_referencia, count(*) as quantidade, SUM(m.valor) as valor_total ' +
      'FROM movimentos m ' +
      'JOIN transacoes t on t.id = m.transacao_id ' +
      'JOIN documentos d on d.id = m.documento_id_origem ' +
      'AND m.data >= \'' + start_date + '\' AND m.data < \'' + end_date + '\' ' +
      'WHERE d.documento IN(\'' + document + '\') ' +
      'AND m.transacao_transacao_tipo_id in (1, 2, 3, 4) ' +
      'AND m.movimento_tipo_id = 2 ' +
      'AND m.movimento_entidade_id_origem IN(4) ' +
      'AND m.movimento_entidade_id_destino IN(3) ';

    sql += 'GROUP BY d.documento, to_char(m.data, \'MM/YYYY\') ' +
      'ORDER BY d.documento ASC, to_char(m.data, \'MM/YYYY\') ASC ';

    let result = await this.db.arranjo.sequelize.query(sql, {
      type: this.db.Sequelize.QueryTypes.SELECT,

      raw: true
    });

    return (result[0] == undefined) ? null : result;
  }

  async createPerformanceTracking(commercial_wallet_id, performanceTracking) {
    let commercial_wallet_performanceTracking = {
      commercial_wallet_id: commercial_wallet_id,
      total_amount: performanceTracking.total_amount,
      reference_date: performanceTracking.reference_date,
      receipt_number: performanceTracking.receipt_number
    };

    return this.db.main
      .commercial_wallet_performance_tracking
      .create(commercial_wallet_performanceTracking);
  }

  async getProfileFromProfileId(profileId) {

    const options = {
      attributes: ['name', 'cpf'],
      where: {
        id: profileId,
      },

      raw: true
    };

    return this.db.core
      .profile
      .findOne(options);

  }

  async getCommercialAnalysts() {

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

  async getMovimentCutId(date_end) {
    const Op = this.db.Sequelize.Op;

    const options = {
      attributes: ['id'],
      where: {
        data_insercao: {
          [Op.gte]: date_end
        }
      },
      order: [
        ['id', 'ASC']
      ],
      raw: true
    };

    return this.db.arranjo
      .movimentos
      .findOne(options);
  }

  async getCountCommercialWalletFromAnalyst(analyst, date_end, type, status, term, status_analyses) {
    let query = 'SELECT count(temp.id) as count_wallet ' +
      'FROM ( ' +
      ' SELECT cw.*, ( ' +
      ' SELECT cws.commercial_wallet_status_type_id ' +
      ' FROM gis.commercial_wallet_status cws ' +
      ' WHERE cws.commercial_wallet_id = cw.id ' +
      ' ORDER BY cws.id DESC ' +
      ' LIMIT 1) AS `status_id` ' +
      ' FROM commercial_wallets cw ' +
      ' WHERE `cw`.`end_date` > "' + this.moment(date_end).format('YYYY-MM-DD') + '" ' +
      ' AND `cw`.`responsible_analyst` = :analyst ' +
      ' AND `cw`.`type` = :type ' +
      ' AND `cw`.`status_analyses` = :status_analyses ';

    if (term) {
      if (RegExp('^[0-9]*$').test(term))
        query += ' AND `cw`.`document` = :term';
      else
        query += ' AND `cw`.`name` LIKE "%' + term + '%"';
    }

    query += ') AS temp ';

    if (status) {
      query += status == '0' ? ' WHERE temp.`status_id` IS NULL ' : ' WHERE temp.`status_id` = :status';
    }

    return await this.db.main.commercial_wallets.sequelize.query(query, {
      type: this.db.main.commercial_wallets.sequelize.QueryTypes.SELECT,
      replacements: {
        analyst: analyst,
        type: type,
        status: status,
        term: term,
        status_analyses: status_analyses
      }
    });
  }

  async getPaginatedCommercialWalletFromAnalyst(analyst, date_end, type, status, term, pagination, six_month, status_analyses) {

    let query = 'SELECT temp2.* FROM (' +
      'SELECT temp.* FROM (' +
      'SELECT `commercial_wallets`.*, (SELECT cws.commercial_wallet_status_type_id FROM gis.commercial_wallet_status cws WHERE cws.commercial_wallet_id = `commercial_wallets`.id ' +
      'ORDER BY cws.id DESC LIMIT 1) AS `status_id`, ' +
      '(SELECT cwst.title FROM gis.commercial_wallet_status cws ' +
      'INNER JOIN gis.commercial_wallet_status_types cwst ON cwst.id = cws.commercial_wallet_status_type_id WHERE cws.commercial_wallet_id = `commercial_wallets`.id ORDER BY cws.id DESC LIMIT 1) AS `status`, ' +
      'cwpt.total_amount, ' +
      'cwpt.receipt_number, ' +
      'cwpt.reference_date, ' +
      'cwpt.variation ' +
      ' FROM `commercial_wallets` AS `commercial_wallets`' +
      ' LEFT JOIN commercial_wallet_performance_tracking cwpt ON cwpt.commercial_wallet_id = `commercial_wallets`.id AND cwpt.reference_date >= "' + this.moment(six_month).format('YYYY-MM-DD') + '" ' +
      ' WHERE `commercial_wallets`.`end_date` > "' + this.moment(date_end).format('YYYY-MM-DD') + '" ' +
      ' AND `commercial_wallets`.`responsible_analyst` = :analyst' +
      ' AND `commercial_wallets`.`status_analyses` = :status_analyses' +
      ' AND `commercial_wallets`.`type` = :type' +
      ' AND  cwpt.id IS NOT NULL';

    if (term) {
      if (RegExp('^[0-9]*$').test(term))
        query += ' AND `commercial_wallets`.`document` = :term';
      else
        query += ' AND `commercial_wallets`.`name` LIKE "%' + term + '%"';
    }

    query += ' ) AS temp';

    if (status) {
      query += status == '0' ? ' WHERE temp.`status_id` IS NULL ' : ' WHERE temp.`status_id` = :status';
    }

    query += ' ) AS temp2';
    query += ' ORDER BY `temp2`.`' + pagination.column + '` ' + pagination.order.toUpperCase() + ', temp2.id ASC, temp2.reference_date ASC ';
    query += ' LIMIT :offset, :limit;';

    return await this.db.main.commercial_wallets.sequelize.query(query, {
      type: this.db.main.commercial_wallets.sequelize.QueryTypes.SELECT,
      replacements: {
        analyst: analyst,
        type: type,
        status: status,
        status_analyses: status_analyses,
        offset: pagination.offset,
        limit: pagination.limit * 6,
        order: pagination.order,
        column: pagination.column,
        term: term
      }
    });
  }

  async getDocumentFromProfileName(name) {
    const Op = this.db.Sequelize.Op;
    const options = {
      attributes: ['cpf'],
      where: {
        name: {
          [Op.like]: '%' + name + '%'
        }
      },
      order: [
        ['id', 'ASC']
      ],
      raw: true
    };

    return this.db.core
      .profile
      .findAll(options);
  }

  async getDocumentFromCorporationName(name) {
    const Op = this.db.Sequelize.Op;
    const options = {
      attributes: ['cnpj'],
      where: {
        name: {
          [Op.like]: '%' + name + '%'
        }
      },
      order: [
        ['id', 'ASC']
      ],
      raw: true
    };

    return this.db.core
      .corporation
      .findAll(options);
  }
  async countCommercialWalletsFromAnalyst(analyst, date_end) {
    const Op = this.db.Sequelize.Op;

    const options = {
      attributes: [
        [this.db.Sequelize.fn('COUNT', this.db.Sequelize.col('id')), 'total']
      ],
      where: {
        end_date: {
          [Op.gt]: date_end
        },
        responsible_analyst: analyst
      },
      raw: true
    };

    return this.db.main
      .commercial_wallets
      .findOne(options);
  }

  async getMaxReferenceValueFromAnalyst(analyst, date_end) {
    const Op = this.db.Sequelize.Op;

    const options = {
      attributes: [
        [this.db.Sequelize.fn('MAX', this.db.Sequelize.col('reference_value')), 'reference_value']
      ],
      where: {
        end_date: {
          [Op.gt]: date_end
        },
        responsible_analyst: analyst
      },
      raw: true
    };

    return this.db.main
      .commercial_wallets
      .findOne(options);
  }

  async getCommercialWalletTypes() {

    const options = {
      attributes: [
        ['type', 'name']
      ],
      raw: true,
      group: ['type']
    };

    return this.db.main
      .commercial_wallets
      .findAll(options);
  }

  async countCommercialWalletsFromAnalystAndType(analyst, date_end, type) {
    const Op = this.db.Sequelize.Op;

    const options = {
      attributes: [
        [this.db.Sequelize.fn('COUNT', this.db.Sequelize.col('id')), 'total']
      ],
      where: {
        end_date: {
          [Op.gt]: date_end
        },
        responsible_analyst: analyst,
        type: type
      },
      raw: true
    };

    return this.db.main
      .commercial_wallets
      .findOne(options);
  }

  async getMaxValueInPerformanceTracking(analyst, date_end, column) {
    const Op = this.db.Sequelize.Op;

    const options = {
      attributes: [
        [this.db.Sequelize.fn('MAX', this.db.Sequelize.col(column)), column]
      ],
      include: [{
        model: this.db.main.commercial_wallets,
        required: true,
        where: {
          end_date: {
            [Op.gt]: date_end
          },
          responsible_analyst: analyst,
        },
      }],
      raw: true
    };

    return this.db.main
      .commercial_wallet_performance_tracking
      .findOne(options);
  }

  async getTotalStatusInserted(analyst, date_end) {
    const Op = this.db.Sequelize.Op;

    const options = {
      attributes: [
        [this.db.Sequelize.fn('COUNT', this.db.Sequelize.col('commercial_wallet_status_type_id')), 'total_status']
      ],
      include: [{
        model: this.db.main.commercial_wallets,
        required: true,
        where: {
          end_date: {
            [Op.gt]: date_end
          },
          responsible_analyst: analyst,
        },
      }],
      group: ['commercial_wallet_id'],
      raw: true
    };

    return this.db.main
      .commercial_wallet_status
      .findAll(options);
  }

  async getTotalStatusInsertedFromType(analyst, date_end, type) {
    const Op = this.db.Sequelize.Op;

    const options = {
      attributes: [
        [this.db.Sequelize.fn('COUNT', this.db.Sequelize.col('commercial_wallet_status_type_id')), 'total_status_' + type]
      ],
      include: [{
        model: this.db.main.commercial_wallets,
        required: true,
        where: {
          end_date: {
            [Op.gt]: date_end
          },
          responsible_analyst: analyst,
          type: type
        },
      }],
      group: ['commercial_wallet_id'],
      raw: true
    };

    return this.db.main
      .commercial_wallet_status
      .findAll(options);
  }

  async getMaxCreatedAt() {

    const options = {
      attributes: [
        [this.db.Sequelize.fn('MAX', this.db.Sequelize.col('created_at')), 'created_at']
      ],
      raw: true,
    };

    return this.db.main
      .commercial_wallet_performance_tracking
      .findOne(options);
  }

  async getCorporationFromDocument(document) {
    const options = {
      attributes: ['name'],
      where: {
        cnpj: document
      },
      raw: true,
    };

    return this.db.core
      .corporation
      .findOne(options);
  }

  async updatePerformanceTrackingVariation(performance_tracking) {
    const options = {
      where: {
        id: performance_tracking.id,
      }
    };
    const update = {
      variation: performance_tracking.variation,
    };
    return this.db.main
      .commercial_wallet_performance_tracking
      .update(update, options);
  }

  async updateCommercialWalletImpactFactor(commercial_wallet) {
    const options = {
      where: {
        id: commercial_wallet.id,
      }
    };
    const update = {
      impact_factor: commercial_wallet.impact_factor,
    };
    return this.db.main
      .commercial_wallets
      .update(update, options);
  }
}

module.exports = CommercialWalletReportPerformanceTrackingRepository;
