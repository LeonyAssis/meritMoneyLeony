'use strict';

class reportsLestaRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async getRatings(descriptions) {
    const Op = this.db.Sequelize.Op;

    let options = {
      attributes: ['id'],
      where: {
        description: {
          [Op.in]: descriptions
        }
      },
      raw: true
    };

    let result = await this.db.intranet
      .ratings
      .findAll(options);

    return result.length == 0 ? [] : result.map(r => r.id);

  }

  async findUser(name, type) {
    const Op = this.db.Sequelize.Op;

    let options = {
      attributes: ['id'],
      raw: true,
    };

    if (type == 'in') {
      options['where'] = {
        name: {
          [Op.in]: name
        }
      };
    } else {
      options['where'] = {
        email: {
          [Op.like]: `%${name}`
        }
      };
    }

    let result = await this.db.intranet
      .user
      .findAll(options);

    return result.length == 0 ? [] : result.map(r => r.id);
  }

  async countTicketsByUser(ratings, users) {
    const Op = this.db.Sequelize.Op;
    let options = {
      include: [{
        model: this.db.intranet.tickets,
        attributes: [],
        required: false,
      }],
      attributes: ['name', 'id', 'email',
        [this.db.Sequelize.fn('SUM', this.db.Sequelize.literal('CASE WHEN tickets.attendant_status_id != 6 THEN 1 ELSE 0 END')), 'INBOX'],
        [this.db.Sequelize.fn('SUM', this.db.Sequelize.literal('CASE WHEN tickets.attendant_status_id != 6 AND tickets.rating_id = :resolved THEN 1 ELSE 0 END')), 'resolved'],
        [this.db.Sequelize.fn('SUM', this.db.Sequelize.literal('CASE WHEN tickets.attendant_status_id != 6 AND tickets.rating_id = :withoutSolution THEN 1 ELSE 0 END')), 'without_solution'],
        [this.db.Sequelize.fn('SUM', this.db.Sequelize.literal('CASE WHEN tickets.attendant_status_id != 6 AND tickets.rating_id = :beingResolved THEN 1 ELSE 0 END')), 'being_resolved'],
        [this.db.Sequelize.fn('SUM', this.db.Sequelize.literal('CASE WHEN tickets.attendant_status_id = 6 THEN 1 ELSE 0 END')), 'archived']
      ],
      where: {
        id: {
          [Op.in]: users
        }
      },
      replacements: {
        resolved: ratings[0],
        withoutSolution: ratings[1],
        beingResolved: ratings[2],
      },
      group: 'id',
      order: [['name', 'ASC']],
      raw: true,
    };

    return this.db.intranet
      .user
      .findAll(options);
  }

  async userMessageCount(gnUser, user_id) {
    let sql = `SELECT
    m.id, tickets.id ticket_id, m.author_id, tickets.created_at,
    IF(m.author_id = :gnUser, SUM(CASE WHEN m.created_at < NOW() - INTERVAL 24 HOUR THEN 1 ELSE 0 END), 0) gn,
    IF(m.author_id != :gnUser, SUM(CASE WHEN m.created_at < NOW() - INTERVAL 24 HOUR AND (m.content NOT LIKE '%Departamento de Relacionamento com o cliente%' AND m.content NOT LIKE '%Departamento de Inteligência de Operações%') THEN 1 ELSE 0 END), 0) cliente,
    IF(m.author_id != :gnUser, SUM(CASE WHEN m.created_at < NOW() - INTERVAL 24 HOUR
				AND (m.content LIKE '%Departamento de Relacionamento com o cliente%'
        OR m.content LIKE '%Departamento de Inteligência de Operações%'
        OR m.content LIKE '%Identificamos que sua conta%'
        OR m.content LIKE '%Verificamos sua demanda e informamos que atualmente%') THEN 1 ELSE 0 END), 0) gn_transfer
    FROM
    tickets
        LEFT JOIN
    messages m ON (m.ticket_id = tickets.id)
    WHERE
    (tickets.attendant_status_id != 6
        AND tickets.owner_id = :user
        AND m.id IN (SELECT
            MAX(id)
        FROM
            messages
        WHERE
            note = 0 AND ticket_id = tickets.id
        GROUP BY ticket_id))
    GROUP BY tickets.id;`;

    return await this.db.intranet.sequelize.query(sql, {
      type: this.db.Sequelize.QueryTypes.SELECT,
      replacements: {
        gnUser,
        user: user_id
      },
      raw: true,
    });
  }

  async getAllTickets(user_id) {
    const Op = this.db.Sequelize.Op;
    let options = {
      include: [{
        model: this.db.intranet.tickets,
        attributes: ['id', 'created_at'],
        where: {
          attendant_status_id: {
            [Op.ne]: 6,
          }
        }
      }],
      attributes: ['email'],
      where: {
        id: user_id
      },
      group: this.db.Sequelize.col('tickets.id'),
      raw: true,
      nest: true
    };

    return await this.db.intranet
      .user
      .findAll(options);
  }


  async interactedTickets(user_id, dates) {
    const Op = this.db.Sequelize.Op;

    let options = {
      attributes: [[this.db.Sequelize.literal('COUNT(DISTINCT(ticket_id))'), 'count']],

      where: {
        [Op.and]: [
          { author_id: user_id },
          {
            created_at: {
              [Op.between]: [`${dates.dateToday} 03:00:00`, `${dates.dateTomorrow} 02:59:59`],
            }
          }
        ]
      },
      raw: true,
    };

    return await this.db.intranet
      .messages
      .count(options);
  }


}

module.exports = reportsLestaRepository;
