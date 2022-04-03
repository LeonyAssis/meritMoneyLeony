'use strict';

const BONUS_PROGRAMA_AFILIADOS = '006';
const COMPENSACAO_PROGRAMA_AFILIADOS = '007';
const DEBITO_COMPENSACOES = '008';
const DEBITO_LANCAMENTO_INTERMEDIACAO_PAGAMENTO = '1002044';

class GetBalanceRepository {

  constructor(params) {
    this.db = params.sequelize;
    this.momentTz = params.momentTz;
    this.config = params.config;
  }

  async getSyncedAvailableBalanceDataBy(account) {
    const balanceData = await this
      .db.transacoes.conta_saldo_disponivel
      .findOne({
        where: {
          conta: account
        },
        raw: true
      });

    if (!balanceData) {
      return null;
    }

    return {
      balance: balanceData.saldo,
      lastSyncedData: balanceData.data_referencia
    };
  }

  async getNotSyncedAvailableBalanceBy(account, lastSyncedDate) {
    const query =
      `
      SELECT (SUM(IF(tipo = 2, valor, 0)) - SUM(IF(tipo = 1, valor, 0))) AS balance
      FROM transacoes
      WHERE
        conta = ${account} AND
        tpTrans NOT IN (${BONUS_PROGRAMA_AFILIADOS}, ${COMPENSACAO_PROGRAMA_AFILIADOS}, ${DEBITO_COMPENSACOES}) AND
        (contestado = :contestado OR codtrans = ${DEBITO_LANCAMENTO_INTERMEDIACAO_PAGAMENTO}) AND
        datalanc <= :now AND datalanc > :retroactiveDate
    `;

    const now = this.momentTz
      .tz(this.config.timezone)
      .format('YYYY-MM-DD');

    const result = await this.db.transacoes.sequelize.query(query, {
      type: this.db.transacoes.sequelize.QueryTypes.SELECT,
      replacements: {
        now: now,
        retroactiveDate: lastSyncedDate,
        contestado: 'n'
      }
    });

    return result && result[0] ? result[0].balance : 0;
  }
}
module.exports = GetBalanceRepository;
