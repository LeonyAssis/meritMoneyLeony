'use strict';

module.exports = {
  41: {
    name: 'gis',
    services: {
      '/rate-negotiations': true,
      '/rate-negotiations/configuration': true,
      '/rate-negotiations/assign-responsible': true,
      '/rate-negotiations/:id/history': true,
      '/rate-negotiations/number-requests': true,
      '/rate-negotiations/reasons': true,
      '/rate-negotiations/:id': true,
      '/rate-negotiations/:id/change-responsible': true,
      '/rate-negotiations/counts': true,
    }
  },
  8: {
    name: 'intranet',
    services: {
      '/rate-negotiations': true,
      '/rate-negotiations/configuration': true,
      '/rate-negotiations/assign-responsible': true,
      '/rate-negotiations/:id/history': true,
      '/rate-negotiations/number-requests': true,
      '/rate-negotiations/reasons': true,
      '/rate-negotiations/:id': true,
      '/rate-negotiations/:id/change-responsible': true,
      '/rate-negotiations/counts': true,
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
