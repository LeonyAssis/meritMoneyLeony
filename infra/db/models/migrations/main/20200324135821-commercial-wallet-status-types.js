'use strict';

module.exports = {
  up: (migration) => {
    return migration.bulkInsert('commercial_wallet_status_types', [
      {
        title: 'Perda - Foi para um concorrente'
      },

      {
        title: 'Perda - Vendeu a empresa / Encerrou as atividades'
      },

      {
        title: 'Perda - Tarifa'
      },

      {
        title: 'Perda - Encerramento da conta pela Análise'
      },

      {
        title: 'Movimentação normal - Até 100 confirmações'
      },

      {
        title: 'Movimentação normal - Entre 101 e 500 confirmações'
      },

      {
        title: 'Movimentação normal - Acima de 501 confirmações'
      },

      {
        title: 'Movimentação normal - Utilização sazonal'
      },

      {
        title: 'Movimentação em queda'
      },

      {
        title: 'Testando a plataforma'
      },

      {
        title: 'Ativação'
      },

      {
        title: 'Recuperação'
      },

      {
        title: 'Bloqueio de análise'
      }

    ], {});
  },

  down: () => {
    return;
  }
};
