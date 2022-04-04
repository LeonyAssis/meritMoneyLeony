'use strict';

module.exports = () => {
  var pkg = require('../../../package.json');
  return {

    get: async (req, res, next) => {
      const commercialWalletBs = req.scope
        .resolve('commercialWalletBs');

      try {
        let commercialWallet = await commercialWalletBs
          .get(req);
        res.status(200)
          .send(commercialWallet);
      } catch (err) {
        next(err);
      }
    },

    create: async (req, res, next) => {
      const commercialWalletBs = req.scope
        .resolve('commercialWalletBs');

      try {
        await commercialWalletBs
          .create(req.body);
        res.status(200)
          .send('200');
      } catch (err) {
        next(err);
      }
    },

    update_type: async (req, res, next) => {
      const commercialWalletBs = req.scope
        .resolve('commercialWalletBs');

      try {
        await commercialWalletBs
          .update_type(req);
        res.status(200)
          .send('200');
      } catch (err) {
        next(err);
      }
    },

    update_responsible: async (req, res, next) => {
      const commercialWalletBs = req.scope
        .resolve('commercialWalletBs');

      try {
        await commercialWalletBs
          .update_responsible(req);
        res.status(200)
          .send('200');
      } catch (err) {
        next(err);
      }
    },

    update_analyses: async (req, res, next) => {
      const commercialWalletBs = req.scope
        .resolve('commercialWalletBs');

      try {
        await commercialWalletBs
          .update_analyses(req);
        res.status(200)
          .send('200');
      } catch (err) {
        next(err);
      }
    },

    update_account_size: async (req, res, next) => {
      const commercialWalletBs = req.scope
        .resolve('commercialWalletBs');

      try {
        await commercialWalletBs
          .update_account_size(req);
        res.status(200)
          .send('200');
      } catch (err) {
        next(err);
      }
    },

    version: async (req, res,next) => {
      const commercialWalletBs = req.scope
      .resolve('commercialWalletBs');

      try {
        await commercialWalletBs
          .testHeroku(req);
        res.status(200)
          .send('200');
      } catch (err) {
        next(err);
      }


      // res.status(200)
      //   .send(`Release version: ${pkg.version}`);
    }
  };
};
