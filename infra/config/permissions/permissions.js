'use strict';

module.exports = {
  41: {
    name: 'gis',
    services: {
      '/document-validation/markup': true,
      '/whatsapp/send': true,
      '/account-relationship/:account': true,
      '/call-history-managers/manager/:id': true,
      '/account/:account/billet/new/rate': true,
      '/reports/lesta/analyst-ticket-info': true,
      '/correios/address-info/:zipcode': true
    }
  },
  8: {
    name: 'intranet',
    services: {
      '/document-validation/markup': true,
      '/whatsapp/send': true,
      '/account-relationship/:account': true,
      '/call-history-managers/manager/:id': true,
      '/account/:account/billet/new/rate': true,
      '/reports/lesta/analyst-ticket-info': true,
      '/correios/address-info/:zipcode': true,
    }
  },
  42: {
    name: 'inteligencia-classificador',
    services: {
    }
  },
  62: {
    name: 'gn-antifraud-infractions',
    services: {
    }
  }
};
