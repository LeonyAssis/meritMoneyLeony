'use strict';

module.exports = () => {
  return {
    run: async (req, res, next) => {
      const documentSituationController = req.scope
        .resolve('documentSituationBs');

      try {
        await documentSituationController
          .get(req);

        res.status(200)
          .send('200');
      } catch (err) {
        next(err);
      }
    },
    block: async (req, res, next) => {
      const documentSituationController = req.scope
        .resolve('documentSituationBs');

      try {
        await documentSituationController
          .block(req);

        res.status(200)
          .send('200');
      } catch (err) {
        next(err);
      }
    }
  };
};
