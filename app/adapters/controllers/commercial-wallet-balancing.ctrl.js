'use strict';

module.exports = () => {
  return {
    run: async (req, res) => {
      const commercialWalletBalancingBs = req.scope
        .resolve('commercialWalletBalancingBs');

      try {
        await commercialWalletBalancingBs
          .execute(req.query);

        res.status(200)
          .end('200');
      } catch (err) {
        res.status(400)
          .end('400:3600');
      }
    }
  };
};
