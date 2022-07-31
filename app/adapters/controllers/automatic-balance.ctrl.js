'use strict';

module.exports = () => {
  return {
    getConfigBalance: async (req, res, next) => {
      const automaticBalanceBs = req.scope
        .resolve('automaticBalanceBs');

      try {
        const balanceConfig = await automaticBalanceBs
          .getConfig(req);

        res.send(balanceConfig)
          .status(200);

      } catch (err) {
        err.status = err.extra.statusCode;
        next(err);
      }
    },

    updateConfigBalance: async (req, res, next) => {
      const automaticBalanceBs = req.scope
        .resolve('automaticBalanceBs');

      try {
        await automaticBalanceBs
          .updateConfig(req);

        res.sendStatus(204);

      } catch (err) {
        err.status = err.extra.statusCode;
        next(err);
      }
    },
  };
};