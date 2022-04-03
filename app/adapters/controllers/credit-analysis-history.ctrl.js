'use strict';

module.exports = () => {
  return {
    get_request: async (req, res, next) => {
      const creditAnalysisHistoryController = req.scope
        .resolve('creditAnalysisHistoryBs');

      try {
        let requests = await creditAnalysisHistoryController
          .getRequests(req);

        res.status(200)
          .send(requests);
      } catch (err) {
        next(err);
      }
    },

    get_responsible: async (req, res, next) => {
      const creditAnalysisHistoryController = req.scope
        .resolve('creditAnalysisHistoryBs');

      try {
        let requests = await creditAnalysisHistoryController
          .getResponsible(req);

        res.status(200)
          .send(requests);
      } catch (err) {
        next(err);
      }
    },

    create: async (req, res, next) => {
      const creditAnalysisHistoryController = req.scope
        .resolve('creditAnalysisHistoryBs');

      try {
        await creditAnalysisHistoryController
          .create(req.body);

        res.status(200)
          .end('200');
      } catch (err) {
        next(err);
      }
    },

  };
};
