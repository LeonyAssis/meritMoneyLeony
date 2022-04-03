'use strict';

module.exports = () => {
  return {
    create: async (req, res, next) => {
      const communicationLargeScaleController = req.scope
        .resolve('communicationLargeScaleBs');

      try {
        await communicationLargeScaleController
          .create(req);

        res.status(200)
          .send('200');
      } catch (err) {
        next(err);
      }
    },

    generate: async (req, res) => {
      const communicationLargeScaleController = req.scope
        .resolve('communicationLargeScaleBs');

      try {
        await communicationLargeScaleController
          .generate(req);

        res.status(200)
          .send('200');
      } catch (err) {
        res.status(400)
          .end('400:360');
      }
    },

    send: async (req, res) => {
      const communicationLargeScaleController = req.scope
        .resolve('communicationLargeScaleBs');

      try {
        await communicationLargeScaleController
          .send(req);

        res.status(200)
          .send('200');
      } catch (err) {
        res.status(400)
          .end('400:360');
      }
    },

    list: async (req, res, next) => {
      const communicationLargeScaleController = req.scope
        .resolve('communicationLargeScaleBs');

      try {
        let resp = await communicationLargeScaleController
          .list(req);

        res.status(200)
          .send(resp);
      } catch (err) {
        next(err);
      }
    },

    updateStatus: async (req, res, next) => {
      const communicationLargeScaleController = req.scope
        .resolve('communicationLargeScaleBs');

      try {
        await communicationLargeScaleController
          .updateStatus(req);

        res.status(200)
          .send('200');
      } catch (err) {
        next(err);
      }
    },

    getStatus: async (req, res, next) => {
      const communicationLargeScaleController = req.scope
        .resolve('communicationLargeScaleBs');

      try {
        let resp = await communicationLargeScaleController
          .getStatus();

        res.status(200)
          .send(resp);
      } catch (err) {
        next(err);
      }
    },

    validate: async (req, res, next) => {
      const communicationLargeScaleController = req.scope
        .resolve('communicationLargeScaleBs');

      try {
        const resp =await communicationLargeScaleController
          .validate(req);

        res.status(200)
          .send(resp);
      } catch (err) {
        next(err);
      }
    },
  };
};
