'use strict';

module.exports = () => {
  return {
    create: async (req, res, next) => {
      const machineOrders = req.scope
        .resolve('machineOrdersBs');

      try {
        await machineOrders.
          create(req.body);
        res.status(200).
          send('200');
      } catch (err) {
        next(err);
      }
    },

    list_orders: async (req, res, next) => {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      const machineOrders = req.scope
        .resolve('machineOrdersBs');

      try {
        const orders = await machineOrders.
          listOrders(req);
        res.status(200).
          send({
            orders: orders.rows,
            currentPage: page,
            pages: Math.ceil(orders.count / limit),
            numOfResults: orders.count,
            limit: limit
          });
      } catch (err) {
        next(err);
      }
    },

    link_tracking: async (req, res, next) => {

      const machineOrders = req.scope
        .resolve('machineOrdersBs');
      try {
        await machineOrders.
          linkTracking(req);
        res.status(200).
          send('200');
      } catch (err) {
        next(err);
      }
    },

    get_order: async (req, res, next) => {

      const machineOrders = req.scope
        .resolve('machineOrdersBs');

      try {
        const order = await machineOrders.
          getOrder(req);
        res.status(200).
          send(order);
      } catch (err) {
        next(err);
      }
    },

    get_order_by_machine_id: async (req, res, next) => {

      const machineOrders = req.scope
        .resolve('machineOrdersBs');

      try {
        const order = await machineOrders.
          getOrderByMachineId(req);
        res.status(200).
          send(order);
      } catch (err) {
        next(err);
      }
    },

    complete_order: async (req, res, next) => {

      const machineOrders = req.scope
        .resolve('machineOrdersBs');

      try {
        let order = await machineOrders.
          completeOrder(req);

        if (order != 200) {
          res.status(500).
            send(order);
        } else {
          res.status(200).
            send('200');
        }

      } catch (err) {
        next(err);
      }
    },

    close_plp: async (req, res, next) => {
      const machineOrders = req.scope
        .resolve('machineOrdersBs');

      try {
        let plp = await machineOrders.closePlp(req);
        res.status(200).send(plp);
      } catch (err) {
        next(err);
      }
    },

    get_correios_label: async (req, res, next) => {
      const machineOrders = req.scope
        .resolve('machineOrdersBs');

      try {
        let plp = await machineOrders.getCorreiosLabel(req);
        res.status(200).send(plp);
      } catch (err) {
        next(err);
      }
    },

    get_correios_ar: async (req, res, next) => {
      const machineOrders = req.scope
        .resolve('machineOrdersBs');

      try {
        let plp = await machineOrders.getCorreiosAr(req);
        res.status(200).send(plp);
      } catch (err) {
        next(err);
      }
    },

    get_correios_plp: async (req, res, next) => {
      const machineOrders = req.scope
        .resolve('machineOrdersBs');

      try {
        let plp = await machineOrders.getCorreiosPlp(req);
        res.status(200).send(plp);
      } catch (err) {
        next(err);
      }
    },

    get_machine_general_shipping_settings: async (req, res, next) => {
      const machineOrders = req.scope
        .resolve('machineOrdersBs');

      try {
        const settings = await machineOrders.getMachineGeneralShippingSettings(req);
        res.status(200).send(settings);
      } catch (err) {
        next(err);
      }
    },


    cancel_order: async (req, res, next) => {
      const machineOrders = req.scope
        .resolve('machineOrdersBs');

      try {
        await machineOrders.cancelOrder(req);

        res.status(200)
          .send('200');
      } catch (err) {
        next(err);
      }
    }


  };
};
