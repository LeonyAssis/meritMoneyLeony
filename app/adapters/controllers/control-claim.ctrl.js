'use strict';

module.exports = () => {
  return {
    getCount: async (req, res, next) => {
      const controlClaimBs = req.scope
        .resolve('controlClaimBs');

      try {
        let status = await controlClaimBs
          .getCount();
        res.status(200)
          .send(status);
      } catch (err) {
        next(err);
      }
    },

    create: async (req, res, next) => {
      const controlClaimBs = req.scope
        .resolve('controlClaimBs');

      try {
        await controlClaimBs.
        create(req);
        res.status(200).
        send('200');
      } catch (err) {
        next(err);
      }
    },

    list: async (req, res, next) => {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      const controlClaimBs = req.scope
        .resolve('controlClaimBs');

      try {
        let claims = await controlClaimBs
          .list(req);

        res.status(200)
          .send({
            claims: claims.rows,
            currentPage: page,
            pages: Math.ceil(claims.count / limit),
            numOfResults: claims.count,
            limit: limit
          });
      } catch (err) {
        next(err);
      }
    },

    listById: async (req, res, next) => {
      const controlClaimBs = req.scope
        .resolve('controlClaimBs');

      try {
        let claim = await controlClaimBs
          .listById(req.params.id);

        res.status(200)
          .send(claim);
      } catch (err) {
        next(err);
      }
    },

    update: async (req, res, next) => {
      const controlClaimBs = req.scope
        .resolve('controlClaimBs');

      try {
        await controlClaimBs
          .update(req);

        res.status(200)
          .end('200');
      } catch (err) {
        next(err);
      }
    },

    sendWarning: async (req, res, next) => {
      const controlClaimBs = req.scope
        .resolve('controlClaimBs');

      try {
        await controlClaimBs
          .sendWarning(req);

        res.status(200)
          .end('200');
      } catch (err) {
        next(err);
      }
    }

  };
};
