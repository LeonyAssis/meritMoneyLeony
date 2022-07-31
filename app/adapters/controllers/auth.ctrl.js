'use strict';

module.exports = () => {

  return {

    version: async (req, res, next) => {
      res.sendStatus(204);
    },

    generateToken: async (req, res, next) => {
      const tokenBs = req.scope.resolve('authBs');

      try {
        const token = await tokenBs
          .generateToken(req);

        res.send(token)
          .status(200);

      } catch (err) {
        err.status = err.extra.statusCode;
        next(err);
      }
    }
  };
};
