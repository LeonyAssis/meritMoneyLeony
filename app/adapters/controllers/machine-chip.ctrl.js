'use strict';

module.exports = () => {
  return {
    create: async (req, res, next) => {
      const machineChipBs = req.scope
        .resolve('machineChipBs');

      try {
        await machineChipBs.
          create(req);
        res.status(200).
          send('200');
      } catch (err) {
        next(err);
      }
    },

    update: async (req, res, next) => {
      const machineChipBs = req.scope
        .resolve('machineChipBs');

      try {
        await machineChipBs.
          update(req);
        res.status(200).
          send('200');
      } catch (err) {
        next(err);
      }
    },

    list: async (req, res, next) => {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      const machineChipBs = req.scope
        .resolve('machineChipBs');

      try {
        let chips = await machineChipBs.
          list(req);

        res.status(200)
          .send({
            chips: chips.rows,
            currentPage: page,
            pages: Math.ceil(chips.count / limit),
            numOfResults: chips.count,
            limit: limit
          });
      } catch (err) {
        next(err);
      }
    },

    list_by_id: async (req, res, next) => {
      const machineChipBs = req.scope
        .resolve('machineChipBs');

      try {
        let chip = await machineChipBs
          .list_by_id(req);

        res.status(200)
          .send(chip);
      } catch (err) {
        next(err);
      }
    },

    list_chip_types: async (req, res, next) => {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      const machineChipBs = req.scope
        .resolve('machineChipBs');

      try {
        let types = await machineChipBs.
          list_chip_types(req);

        res.status(200)
          .send({
            types: types.rows,
            currentPage: page,
            pages: Math.ceil(types.count / limit),
            numOfResults: types.count,
            limit: limit
          });
      } catch (err) {
        next(err);
      }
    },

    get_by_simcard: async (req, res, next) => {
      const machineChipBs = req.scope
        .resolve('machineChipBs');

      try {
        let chip = await machineChipBs
          .get_by_simcard(req);

        res.status(200)
          .send(chip);
      } catch (err) {
        next(err);
      }
    },

    available_quantity: async (req, res, next) => {

      const machineChipBs = req.scope
        .resolve('machineChipBs');

      try {
        let quantity = await machineChipBs
          .getAvailableQuantity();

        res.status(200)
          .send(quantity);
      } catch (err) {
        next(err);
      }
    }

  };
};
