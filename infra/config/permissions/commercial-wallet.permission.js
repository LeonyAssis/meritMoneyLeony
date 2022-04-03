'use strict';

module.exports = {
  41: {
    name: 'gis',
    services: {
      '/commercial-wallet/notes': true,
      '/commercial-wallet/:commercial_wallet_id/notes': true,
      '/commercial-wallet/note-types': true,
      '/commercial-wallet/status': true,
      '/commercial-wallet/:commercial_wallet_id/status': true,
      '/commercial-wallet/report-performance-tracking/generate': true,
      '/commercial-wallet/report-performance-tracking/send': true,
      '/commercial-wallet/document/:document': true,
      '/commercial-wallet/balancing': true,
      '/commercial-wallet/document/:document/notes': true,
      '/commercial-wallet/document/:document/status': true,
      '/commercial-wallet/status-types': true,
      '/commercial-wallets': true,
      '/commercial-wallet/report-performance-tracking': true,
      '/commercial-wallet/resume': true,
      '/commercial-wallets/:id/type': true,
      '/commercial-wallets/:id/transfer': true,
      '/commercial-wallets/:id/analyses': true,
      '/commercial-wallets/:id/sizes': true,
    }
  },
  8: {
    name: 'intranet',
    services: {
      '/commercial-wallet/notes': true,
      '/commercial-wallet/:commercial_wallet_id/notes': true,
      '/commercial-wallet/note-types': true,
      '/commercial-wallet/status': true,
      '/commercial-wallet/:commercial_wallet_id/status': true,
      '/commercial-wallet/report-performance-tracking/generate': true,
      '/commercial-wallet/report-performance-tracking/send': true,
      '/commercial-wallet/document/:document': true,
      '/commercial-wallet/balancing': true,
      '/commercial-wallet/document/:document/notes': true,
      '/commercial-wallet/document/:document/status': true,
      '/commercial-wallet/status-types': true,
      '/commercial-wallets': true,
      '/commercial-wallet/report-performance-tracking': true,
      '/commercial-wallet/resume': true,
      '/commercial-wallets/:id/type': true,
      '/commercial-wallets/:id/transfer': true,
      '/commercial-wallets/:id/analyses': true,
      '/commercial-wallets/:id/sizes': true
    }
  },
  42: {
    name: 'inteligencia-classificador',
    services: {
      '/commercial-wallets/:id/type': true,
      '/commercial-wallets/:id/transfer': true,
      '/commercial-wallets/:id/analyses': true,
      '/commercial-wallets': true,
      '/commercial-wallets/:id/sizes': true
    }
  },
  62: {
    name: 'gn-antifraud-infractions',
    services: {
    }
  }
};
