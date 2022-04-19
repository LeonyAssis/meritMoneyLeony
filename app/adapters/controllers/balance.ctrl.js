'use strict';

module.exports = () => {
  return {
    getBalance: async (req, res, next) => {
      const balanceBs = req.scope.resolve('balanceBs');

      try {
        const balance = await balanceBs
          .getBalance(req);

        res.send(balance)
          .status(200);

      } catch (error) {
        next(error);
      }
    },

    transferMoney: async (req, res, next) => {
      const balanceBs = req.scope.resolve('balanceBs');

      try {
        const balance = await balanceBs
          .transferMoney(req);

        res.send()
          .status(200);

      } catch (error) {
        next(error);
      }
    }
  };
};