'use strict';

module.exports = () => {
  return {
    getBenefits: async (req, res, next) => {
      const benefitsBs = req.scope.resolve('benefitsBs');

      try {
        const benefits = await benefitsBs
          .getBenefits(req);

        res.send(benefits)
          .status(200);
      } catch (err) {
        next(err);
      }
    },

    getBenefit: async (req, res, next) => {
      const benefitsBs = req.scope.resolve('benefitsBs');

      try {
        const benefits = await benefitsBs
          .getBenefit(req);

        res.send(benefits)
          .status(200);
      } catch (err) {
        next(err);
      }
    },

    upsertBenefits: async (req, res, next) => {
      const benefitsBs = req.scope.resolve('benefitsBs');

      try {
        await benefitsBs
          .upsertBenefits(req);

        res.sendStatus(204);

      } catch (err) {
        next(err);
      }
    },

    updateBenefits: async (req, res, next) => {
      const benefitsBs = req.scope.resolve('benefitsBs');

      try {
        await benefitsBs
          .updateBenefits(req);

        res.sendStatus(204);

      } catch (err) {
        err.status = err.extra.statusCode;
        next(err);
      }
    },

    buyBenefits: async (req, res, next) => {
      const benefitsBs = req.scope.resolve('benefitsBs');
      
      try {
        await benefitsBs
          .buyBenefits(req);
        res.sendStatus(204);
      } catch (err) {
        err.status = err.extra.statusCode;
        next(err);
      }
    },
  };
};