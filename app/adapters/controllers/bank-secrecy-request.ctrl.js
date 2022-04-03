'use strict';

module.exports = () => {
  return {
    create: async (req, res, next) => {
      const bankSecrecyRequestBs = req.scope
        .resolve('bankSecrecyRequestBs');
      try {
        await bankSecrecyRequestBs
          .create(req.body);

        res.status(200)
          .end('200');
      } catch (err) {
        next(err);
      }
    },

    list: async (req, res, next) => {
      const bankSecrecyRequestBs = req.scope
        .resolve('bankSecrecyRequestBs');

      try {
        let result = await bankSecrecyRequestBs
          .list(req);

        res.status(200)
          .send({
            data: result.data,
            size: result.size,
          });
      } catch (err) {
        next(err);
      }
    },

    update: async (req, res, next) => {
      const bankSecrecyRequestBs = req.scope
        .resolve('bankSecrecyRequestBs');

      try {
        await bankSecrecyRequestBs
          .update(req);

        res.status(200)
          .end('200');
      } catch (err) {
        next(err);
      }
    },
  };
};
