'use strict';

module.exports = (app, ctrls, mdws) => {
  app.route('/machines/models')
    .get(
      mdws.authorize,
      ctrls.machineController.list_models
    );

  app.route('/machines/quantity')
    .get(
      mdws.authorize,
      ctrls.machineController.get_quantity_machines
    );

  app.route('/machines/manufacturers')
    .get(
      mdws.authorize,
      ctrls.machineController.list_manufacturers
    );

  app.route('/machines/models/checklist')
    .get(
      mdws.authorize,
      ctrls.machineController.list_models_checklist
    );

  app.route('/machines/coils')
    .post(
      mdws.authorize,
      ctrls.machineCoilStockController.create_stock
    );

  app.route('/machines/coils')
    .get(
      mdws.authorize,
      ctrls.machineCoilStockController.list_stock
    );

  app.route('/machines/coils/available')
    .get(
      mdws.authorize,
      ctrls.machineCoilStockController.available_quantity
    );

  app.route('/machines/chips')
    .post(
      mdws.authorize,
      ctrls.machineChipController.create
    );

  app.route('/machines/chips')
    .get(
      mdws.authorize,
      ctrls.machineChipController.list
    );

  app.route('/machines/chips/types')
    .get(
      mdws.authorize,
      ctrls.machineChipController.list_chip_types
    );

  app.route('/machines/chips/simcard/:simcard_serial')
    .get(
      ctrls.machineChipController.get_by_simcard
    );

  app.route('/machines/chips/available')
    .get(
      mdws.authorize,
      ctrls.machineChipController.available_quantity
    );

  app.route('/machines/chips/:id')
    .put(
      mdws.authorize,
      ctrls.machineChipController.update
    );

  app.route('/machines/chips/:id')
    .get(
      mdws.authorize,
      ctrls.machineChipController.list_by_id
    );

  app.route('/machines/orders')
    .post(
      mdws.authorize,
      ctrls.machineOrdersController.create
    );

  app.route('/machines/orders')
    .get(
      mdws.authorize,
      ctrls.machineOrdersController.list_orders
    );

  app.route('/machines/orders/general-settings')
    .get(
      mdws.authorize,
      ctrls.machineOrdersController.get_machine_general_shipping_settings
    );

  app.route('/machines/orders/:order_id')
    .get(
      mdws.authorize,
      ctrls.machineOrdersController.get_order
    );

  app.route('/machines/orders/:order_id/shipping')
    .put(
      mdws.authorize,
      ctrls.machineOrdersController.link_tracking
    );

  app.route('/machines/orders/:order_id/complete')
    .post(
      mdws.authorize,
      ctrls.machineOrdersController.complete_order
    );

  app.route('/machines/orders/:order_id/cancel')
    .post(
      mdws.authorize,
      ctrls.machineOrdersController.cancel_order
    );

  app.route('/machines/orders/:order_id/close-plp')
    .get(
      mdws.authorize,
      ctrls.machineOrdersController.close_plp
    );

  app.route('/machines/orders/:order_id/correios-label')
    .get(
      mdws.authorize,
      ctrls.machineOrdersController.get_correios_label
    );

  app.route('/machines/orders/:order_id/correios-ar')
    .get(
      mdws.authorize,
      ctrls.machineOrdersController.get_correios_ar
    );

  app.route('/machines/orders/:order_id/correios-plp')
    .get(
      mdws.authorize,
      ctrls.machineOrdersController.get_correios_plp
    );

  app.route('/machines')
    .post(
      mdws.authorize,
      ctrls.machineController.create
    );

  app.route('/machines')
    .get(
      mdws.authorize,
      ctrls.machineController.list
    );

  app.route('/machines/orders/:order_id/invoices')
    .post(
      mdws.authorize,
      ctrls.machineInvoicesController.create_invoice
    );


  app.route('/machines/serialnumber/:serial_number')
    .get(
      mdws.authorize,
      ctrls.machineController.details_by_serial_number
    );

  app.route('/machines/alerts/:id/notes')
    .post(
      mdws.authorize,
      ctrls.machineAlertsController.create_alert_note
    );

  app.route('/machines/alerts/:id/notes')
    .get(
      mdws.authorize,
      ctrls.machineAlertsController.get_alert_notes
    );

  app.route('/machines/alerts/:id/markup')
    .post(
      mdws.authorize,
      ctrls.machineAlertsController.markup_alert
    );

  app.route('/machines/alerts/:id/unmark')
    .put(
      mdws.authorize,
      ctrls.machineAlertsController.unmark_alert
    );

  app.route('/machines/alerts/:id/evaluate')
    .post(
      mdws.authorize,
      ctrls.machineAlertsController.evaluate_alert
    );

  app.route('/machines/alerts/:id/tickets')
    .get(
      mdws.authorize,
      ctrls.machineAlertsController.get_tickets_by_alert
    );

  app.route('/machines/tickets/:ticket_id/alert')
    .get(
      mdws.authorize,
      ctrls.machineAlertsController.get_ticket_alert
    );

  app.route('/machines/alerts/:id')
    .get(
      mdws.authorize,
      ctrls.machineAlertsController.get_alert
    );

  app.route('/machines/alerts')
    .get(
      mdws.authorize,
      ctrls.machineAlertsController.get_alerts
    );

  app.route('/machines/:machine_id/order')
    .get(
      mdws.authorize,
      ctrls.machineOrdersController.get_order_by_machine_id
    );

  app.route('/machines/:machine_id')
    .put(
      mdws.authorize,
      ctrls.machineController.update
    );

  app.route('/machines/:machine_id')
    .get(
      mdws.authorize,
      ctrls.machineController.details_by_id
    );
};
