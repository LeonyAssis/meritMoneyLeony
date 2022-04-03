'use strict';

module.exports = () => {
  return {
    run: async (req, res) => {
      const commercialWalletAccountsActivateBs = req.scope
        .resolve('commercialWalletAccountsActivateBs');

      try {
        await commercialWalletAccountsActivateBs
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
