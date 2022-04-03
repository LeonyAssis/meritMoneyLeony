'use strict';

module.exports = () => {
  return {
    create: async (req, res, next) => {
      const documentAnalysesClassificationController = req.scope
        .resolve('documentAnalysesClassificationBs');
      try {
        await documentAnalysesClassificationController
          .create(req);

        res.status(200)
          .send('200');
      } catch (err) {
        next(err);
      }
    },

    get: async (req, res, next) => {
      const documentAnalysesClassificationController = req.scope
        .resolve('documentAnalysesClassificationBs');
      try {
        let resp = await documentAnalysesClassificationController
          .get(req);

        res.status(200)
          .send(resp);
      } catch (err) {
        next(err);
      }
    },
  };
};
