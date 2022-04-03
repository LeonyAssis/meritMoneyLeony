'use strict';

module.exports = () => {
  return {
    create: async (req, res, next) => {
      const rateNegotiationsBs = req.scope
        .resolve('rateNegotiationsBs');

      try {
        await rateNegotiationsBs
          .create(req);

        res.status(200)
          .send('200');
      } catch (err) {
        next(err);
      }
    },

    list: async (req, res, next) => {
      const rateNegotiationsBs = req.scope
        .resolve('rateNegotiationsBs');

      try {
        let resp = await rateNegotiationsBs
          .list(req);

        res.status(200)
          .send(resp);
      } catch (err) {
        next(err);
      }
    },

    configuration_update: async (req, res, next) => {
      const rateNegotiationsBs = req.scope
        .resolve('rateNegotiationsBs');

      try {
        let code = await rateNegotiationsBs
          .configuration_update(req);

        res.status(code)
          .send(code.toString());
      } catch (err) {
        next(err);
      }
    },

    assign_responsible: async (req, res, next) => {
      const rateNegotiationsBs = req.scope
        .resolve('rateNegotiationsBs');

      try {
        await rateNegotiationsBs
          .assign_responsible(req);

        res.status(200)
          .send('200');
      } catch (err) {
        next(err);
      }
    },

    history: async (req, res, next) => {
      const rateNegotiationsBs = req.scope
        .resolve('rateNegotiationsBs');

      try {
        let resp = await rateNegotiationsBs
          .history(req);

        res.status(200)
          .send(resp);
      } catch (err) {
        next(err);
      }
    },

    has_negotiations_in_period: async (req, res, next) => {
      const rateNegotiationsBs = req.scope
        .resolve('rateNegotiationsBs');

      try {
        let resp = await rateNegotiationsBs
          .has_negotiations_in_period(req);

        res.status(200)
          .send(resp);
      } catch (err) {
        next(err);
      }
    },

    get: async (req, res, next) => {
      const rateNegotiationsBs = req.scope
        .resolve('rateNegotiationsBs');

      try {
        let resp = await rateNegotiationsBs
          .get(req);

        res.status(200)
          .send(resp);
      } catch (err) {
        next(err);
      }
    },

    get_rate_negotiations_reasons: async (req, res, next) => {
      const rateNegotiationsBs = req.scope
        .resolve('rateNegotiationsBs');

      try {
        let resp = await rateNegotiationsBs
          .get_rate_negotiations_reasons();

        res.status(200)
          .send(resp);
      } catch (err) {
        next(err);
      }
    },

    get_counts: async (req, res, next) => {
      const rateNegotiationsBs = req.scope
        .resolve('rateNegotiationsBs');

      try {
        let resp = await rateNegotiationsBs
          .get_counts(req);

        res.status(200)
          .send(resp);
      } catch (err) {
        next(err);
      }
    },

    change_responsible: async (req, res, next) => {
      const rateNegotiationsBs = req.scope
        .resolve('rateNegotiationsBs');

      try {
        await rateNegotiationsBs
          .change_responsible(req);

        res.status(200)
          .send('200');
      } catch (err) {
        next(err);
      }
    },
  };
};
