'use strict';

module.exports = () => {
  return {
    create: async (req, res, next) => {
      const commercialWalletStatusBs = req.scope
        .resolve('commercialWalletStatusBs');

      try {
        await commercialWalletStatusBs
          .create(req.body);

        res.status(200)
          .end('200');
      } catch (err) {
        next(err);
      }
    },

    list: async (req, res, next) => {
      const commercialWalletStatusBs = req.scope
        .resolve('commercialWalletStatusBs');

      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      try {
        let status = await commercialWalletStatusBs
          .list(req);
        res.status(200)
          .send({
            status: status,
            currentPage: page,
            pages: Math.ceil(status.length / limit),
            numOfResults: status.length,
            limit: limit
          });
      } catch (err) {
        next(err);
      }
    },

    listbydocument: async (req, res, next) => {
      const commercialWalletStatusBs = req.scope
        .resolve('commercialWalletStatusBs');

      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      try {
        let status = await commercialWalletStatusBs
          .list_by_document(req);

        res.status(200)
          .send({
            status: status,
            currentPage: page,
            pages: Math.ceil(status.length / limit),
            numOfResults: status.length,
            limit: limit
          });
      } catch (err) {
        next(err);
      }
    }
  };
};
