'use strict';

module.exports = {
  41: {
    name: 'gis',
    services: {
      '/communication/large-scale': true,
      '/communication/large-scale/validate': true,
      '/communication/large-scale/:id': true,
      '/communication/large-scale/status': true,
    }
  },
  8: {
    name: 'intranet',
    services: {
      '/communication/large-scale': true,
      '/communication/large-scale/validate': true,
      '/communication/large-scale/:id': true,
      '/communication/large-scale/status': true,
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
