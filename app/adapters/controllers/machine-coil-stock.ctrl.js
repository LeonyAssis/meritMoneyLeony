'use strict';

module.exports = () => {
  return {
    create_stock: async (req, res, next) => {
      const machineCoilStock = req.scope
        .resolve('machineCoilStockBs');

      try {
        await machineCoilStock.
          create(req);
        res.status(200).
          send('200');
      } catch (err) {
        next(err);
      }
    },

    list_stock: async (req, res, next) => {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      const machineCoilStock = req.scope
        .resolve('machineCoilStockBs');

      try {
        let coils = await machineCoilStock
          .list(req);

        res.status(200)
          .send({
            coils: coils.rows,
            currentPage: page,
            pages: Math.ceil(coils.count / limit),
            numOfResults: coils.count,
            limit: parseInt(limit)
          });
      } catch (err) {
        next(err);
      }
    },

    available_quantity: async (req, res, next) => {

      const machineCoilStock = req.scope
        .resolve('machineCoilStockBs');

      try {
        let quantity = await machineCoilStock
          .getAvailableQuantity();

        res.status(200)
          .send(quantity);
      } catch (err) {
        next(err);
      }
    }

  };
};
