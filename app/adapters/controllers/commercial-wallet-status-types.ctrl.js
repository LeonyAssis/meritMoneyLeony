'use strict';

module.exports = () => {
  return {
    list: async (req, res, next) => {
      const commercialWalletStatusTypesBs = req.scope
        .resolve('commercialWalletStatusTypesBs');

      try {
        let status_types = await commercialWalletStatusTypesBs
          .list();

        res.status(200)
          .send(status_types);
      } catch (err) {
        next(err);
      }
    }
  };
};
