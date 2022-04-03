'use strict';

class AccountRelationshipsRepository {

  constructor(params) {
    this.db = params.sequelize;
  }

  async getAccountRelationships(account) {
    let options = {
      where: {
        account: account
      },
      raw: true,
      order: [
        ['last_transaction', 'DESC']
      ]
    };

    let result = this.db.main.account_relationships.findAll(options);
    return result;
  }

  async getTransactionClient(account) {
    let options = {
      attributes: ['id', 'conta', 'responsavel'],
      where: {
        conta: account
      },
      raw: true
    };

    let result = this.db.erp.cliente_transacao.findOne(options);

    return result;
  }

  async getAccountPartners(transaction_client_id) {

    let sql = `SELECT t.data_insercao, t.parceiro_id, p.nome, t.cliente_transacao_id
    FROM erp.transacoes t
      INNER JOIN (
        SELECT MAX(t.id) AS id
        FROM erp.transacoes t
        WHERE t.cliente_transacao_id = ${transaction_client_id}
          AND t.parceiro_id IS NOT NULL
          AND t.tipo_transacao_id IN (1,2)
        GROUP BY t.parceiro_id
      ) m ON t.id = m.id
      INNER JOIN erp.parceiro p
      ON t.parceiro_id = p.id
    ORDER BY t.id desc;`;

    let result = await this.db.erp.sequelize.query(sql, {
      type: this.db.Sequelize.QueryTypes.SELECT,
      raw: true,
    });

    return result;
  }

  async getFirstTransactionDate(clientTransactionId, parceiro) {
    if (parceiro == null) {
      parceiro = 'AND parceiro_id is NULL ';
    } else {
      parceiro = 'AND parceiro_id = ' + `${parceiro} `;
    }


    let sql = 'SELECT data_insercao FROM transacoes WHERE cliente_transacao_id =' + `${clientTransactionId} ` +
      parceiro +
      'ORDER BY data_insercao ASC ' +
      'LIMIT 1; ';


    let result = await this.db.erp.sequelize.query(sql, {
      type: this.db.Sequelize.QueryTypes.SELECT,
      raw: true
    });

    return result;
  }

  async createAccountRelationship(accountPartner) {

    return this.db.main
      .account_relationships
      .create(accountPartner);
  }

  async updateAccountRelationship(data, id) {
    const options = {
      where: {
        id: id
      }
    };
    return this.db.main
      .account_relationships
      .update(data, options);

  }
}

module.exports = AccountRelationshipsRepository;
