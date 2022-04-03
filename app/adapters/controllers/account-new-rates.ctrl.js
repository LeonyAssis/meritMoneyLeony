'use strict';

module.exports = () => {
  return {
    execute: async (req, res) => {
      const accountNewRatesController = req.scope
        .resolve('accountNewRatesBs');

      try {
        await accountNewRatesController
          .execute(req);

        res.status(200)
          .send('200');
      } catch (err) {
        res.status(400)
          .end('400:360');
      }
    },

    get: async (req, res, next) => {
      const accountNewRatesController = req.scope
        .resolve('accountNewRatesBs');

      try {
        let resp = await accountNewRatesController
          .get(req);

        res.status(200)
          .send(resp);
      } catch (err) {
        next(err);
      }
    },
  };
};
