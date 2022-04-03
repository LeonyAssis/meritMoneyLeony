const constants = {
  COMMERCIAL_WALLET: {
    ACCOUNTS_ACTIVATE: {
      INTERVAL_DAYS: 15,
      NUMBER_RECEIPTS: 3,
      NUMBER_EMISSIONS: 10
    },
    S3: {
      PATH_PERFOMANCE_TRACKING: 'gis/reports/commercial_wallets/performance_tracking/'
    },
    LIMIT_PER_ANALYST: 1300
  },
  CONTA_ENVIO_EMAIL: 20010,

  CORREIOS: {
    CALCPRECOPRAZO: {
      FUNCTION: 'CalcPrecoPrazo',
      FORMATOS: {
        CAIXAPACOTE: 1,
        ROLOPRISMA: 2,
        ENVELOPE: 3
      },
      SERVICOS: {
        SEDEX: '04014',
        SEDEXCOBRAR: '04065',
        PAC: '04510',
        PACCOBRAR: '04707',
        SEDEX10: '40215',
        SEDEX12: '40169',
        SEDEXHOJE: '40290',
      }
    },
    ATENDECLIENTE: {
      CONSULTACEP: {
        FUNCTION: 'consultaCEP',
      },
      BUSCACLIENTE: {
        FUNCTION: 'buscaCliente',
      },
      VERIFICADISPONIBILIDADESERVICO: {
        FUNCTION: 'verificaDisponibilidadeServico',
      },
      GETSTATUSCARTAOPOSTAGEM: {
        FUNCTION: 'getStatusCartaoPostagem',
      },
      SOLICITAETIQUETAS: {
        FUNCTION: 'solicitaEtiquetas',
      },
      GERADIGITOVERIFICADORETIQUETAS: {
        FUNCTION: 'geraDigitoVerificadorEtiquetas',
      },
      FECHAPLPVARIOSSERVICOS: {
        FUNCTION: 'fechaPlpVariosServicos',
      },
      SOLICITAXMLPLP: {
        FUNCTION: 'solicitaXmlPlp'
      }
    }
  }
};

module.exports = constants;
