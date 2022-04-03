'use strict';

module.exports = {
  41: {
    name: 'gis',
    services: {
      '/document-analyses/classification': true,
      '/document-analyses/classification/document/:document': true,
    }
  },
  8: {
    name: 'intranet',
    services: {
      '/document-analyses/classification': true,
      '/document-analyses/classification/document/:document': true,
    }
  },
  42: {
    name: 'inteligencia-classificador',
    services: {
      '/document-analyses/classification': true,
    }
  },
  62: {
    name: 'gn-antifraud-infractions',
    services: {
      '/document-analyses/classification/document/:document': true
    }
  }
};
