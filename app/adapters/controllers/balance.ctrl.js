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

      } catch (err) {
        err.status = err.extra.statusCode;
        next(err);
      }
    },

    transferMoney: async (req, res, next) => {
      const balanceBs = req.scope.resolve('balanceBs');

      try {
        const balance = await balanceBs
          .transferMoney(req);

        res.send()
          .status(200);

      } catch (err) {
        err.status = err.extra.statusCode;
        next(err);
      }
    },


    getBalanceHistories: async (req, res, next) => {
      const balanceHistoriesBs = req.scope.resolve('balanceBs');

      try {
        const balances = await balanceHistoriesBs
          .getBalanceHistories(req);

        res.send(balances)
          .status(200);

      } catch (error) {
        next(error);
      }
    }
  };
};