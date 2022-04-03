'use strict';

module.exports = {
  41: {
    name: 'gis',
    services: {
      '/control-claims/:id/professionals': true,
      '/control-claims/professionals/:id': true,
      '/control-claims/count': true,
      '/control-claims': true,
      '/control-claims/types': true,
      '/control-claims/:id': true,
      '/control-claims/:id/comments': true,
      '/control-claims/:id/tickets': true,
      '/control-claims/ticket/:ticket_id': true,
    }
  },
  8: {
    name: 'intranet',
    services: {
      '/control-claims/count': true,
      '/control-claims': true,
      '/control-claims/types': true,
      '/control-claims/:id': true,
      '/control-claims/:id/professionals': true,
      '/control-claims/:id/comments': true,
      '/control-claims/:id/tickets': true,
      '/control-claims/ticket/:ticket_id': true,
      '/control-claims/professionals/:id': true,
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
