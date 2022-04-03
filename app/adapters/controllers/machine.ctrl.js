'use strict';

module.exports = () => {
  return {

    create: async (req, res, next) => {
      const machineBs = req.scope
        .resolve('machineBs');

      try {
        await machineBs
          .create(req);

        res.status(200)
          .end('200');
      } catch (err) {
        next(err);
      }
    },

    list: async (req, res, next) => {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      const machineBs = req.scope
        .resolve('machineBs');

      try {
        let machines = await machineBs
          .list(req);

        res.status(200)
          .send({
            machines: machines.rows,
            currentPage: page,
            pages: Math.ceil(machines.count / limit),
            numOfResults: machines.count,
            limit: limit
          });
      } catch (err) {
        next(err);
      }
    },

    update: async (req, res, next) => {
      const machineBs = req.scope
        .resolve('machineBs');

      try {
        await machineBs
          .update(req);

        res.status(200)
          .end('200');
      } catch (err) {
        next(err);
      }
    },

    details_by_id: async (req, res, next) => {
      const machineBs = req.scope
        .resolve('machineBs');

      try {
        let machine = await machineBs
          .details_by_id(req);

        res.status(200)
          .send(machine);
      } catch (err) {
        next(err);
      }
    },

    details_by_serial_number: async (req, res, next) => {
      const machineBs = req.scope
        .resolve('machineBs');

      try {
        let machine = await machineBs
          .details_by_serial_number(req);

        res.status(200)
          .send(machine);
      } catch (err) {
        next(err);
      }
    },

    list_models: async (req, res, next) => {
      const machineBs = req.scope
        .resolve('machineBs');

      try {
        let models = await machineBs
          .list_models(req);

        res.status(200)
          .send(models);
      } catch (err) {
        next(err);
      }
    },

    list_manufacturers: async (req, res, next) => {
      const machineBs = req.scope
        .resolve('machineBs');

      try {
        let manufacturers = await machineBs
          .list_manufacturers(req);

        res.status(200)
          .send(manufacturers);
      } catch (err) {
        next(err);
      }
    },

    list_models_checklist: async (req, res, next) => {
      const machineBs = req.scope
        .resolve('machineBs');

      try {
        let models = await machineBs
          .list_models_checklist(req);

        res.status(200)
          .send(models);
      } catch (err) {
        next(err);
      }
    },

    list_by_account: async (req, res, next) => {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      const machineBs = req.scope
        .resolve('machineBs');

      try {
        let machines = await machineBs
          .list_by_account(req);

        res.status(200)
          .send({
            machines: machines.rows,
            currentPage: page,
            pages: Math.ceil(machines.count / limit),
            numOfResults: machines.count,
            limit: limit
          });
      } catch (err) {
        next(err);
      }
    },

    link_account: async (req, res, next) => {
      const machineBs = req.scope
        .resolve('machineBs');

      try {
        await machineBs
          .link_account(req);

        res.status(200)
          .end('200');
      } catch (err) {
        next(err);
      }
    },

    activateClient: async (req, res, next) => {
      const machineBs = req.scope
        .resolve('machineBs');

      try {
        await machineBs
          .activateClient(req);

        res.status(200)
          .send('200');
      } catch (err) {
        next(err);
      }
    },

    get_quantity_machines: async (req, res, next) => {
      const machineBs = req.scope
        .resolve('machineBs');

      try {
        const quantity_machines = await machineBs
          .getQuantityMachines(req);

        res.status(200)
          .send(quantity_machines);
      } catch (err) {
        next(err);
      }
    }

  };
};
