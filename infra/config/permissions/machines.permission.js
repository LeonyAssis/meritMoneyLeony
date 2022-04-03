'use strict';

module.exports = {
  41: {
    name: 'gis',
    services: {
      '/machines/models': true,
      '/machines/quantity': true,
      '/machines/manufacturers': true,
      '/machines/models/checklist': true,
      '/machines/coils': true,
      '/machines/coils/available': true,
      '/machines/chips': true,
      '/machines/chips/types': true,
      '/machines/chips/simcard/:simcard_serial': true,
      '/machines/chips/available': true,
      '/machines/chips/:id': true,
      '/machines/orders': true,
      '/machines/orders/general-settings': true,
      '/machines/orders/:order_id': true,
      '/machines/orders/:order_id/shipping': true,
      '/machines/orders/:order_id/complete': true,
      '/machines/orders/:order_id/cancel': true,
      '/machines/orders/:order_id/close-plp': true,
      '/machines/orders/:order_id/correios-label': true,
      '/machines/orders/:order_id/correios-ar': true,
      '/machines/orders/:order_id/correios-plp': true,
      '/machines': true,
      '/machines/orders/:order_id/invoices': true,
      '/machines/serialnumber/:serial_number': true,
      '/machines/:machine_id': true,
      '/machines/:machine_id/order': true,
      '/machines/alerts': true,
      '/machines/alerts/:id': true,
      '/machines/alerts/:id/notes': true,
      '/machines/alerts/:id/evaluate': true,
      '/machines/alerts/:id/tickets': true,
      '/machines/tickets/:ticket_id/alert': true,
      '/machines/alerts/:id/markup': true,
      '/machines/alerts/:id/unmark': true
    }
  },
  8: {
    name: 'intranet',
    services: {
      '/machines/models': true,
      '/machines/quantity': true,
      '/machines/manufacturers': true,
      '/machines/models/checklist': true,
      '/machines/coils': true,
      '/machines/coils/available': true,
      '/machines/chips': true,
      '/machines/chips/types': true,
      '/machines/chips/simcard/:simcard_serial': true,
      '/machines/chips/available': true,
      '/machines/chips/:id': true,
      '/machines/orders': true,
      '/machines/orders/general-settings': true,
      '/machines/orders/:order_id': true,
      '/machines/orders/:order_id/shipping': true,
      '/machines/orders/:order_id/complete': true,
      '/machines/orders/:order_id/cancel': true,
      '/machines/orders/:order_id/close-plp': true,
      '/machines/orders/:order_id/correios-label': true,
      '/machines/orders/:order_id/correios-ar': true,
      '/machines/orders/:order_id/correios-plp': true,
      '/machines': true,
      '/machines/orders/:order_id/invoices': true,
      '/machines/serialnumber/:serial_number': true,
      '/machines/:machine_id': true,
      '/machines/:machine_id/order': true,
      '/machines/alerts': true,
      '/machines/alerts/:id': true,
      '/machines/alerts/:id/notes': true,
      '/machines/alerts/:id/evaluate': true,
      '/machines/alerts/:id/tickets': true,
      '/machines/tickets/:ticket_id/alert': true,
      '/machines/alerts/:id/markup': true,
      '/machines/alerts/:id/unmark': true
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
