'use strict';

module.exports = () => {
  return {

    create: async (req, res, next) => {
      const documentValidationMarkupBs = req.scope
        .resolve('documentValidationMarkupBs');

      try {
        let markup = await documentValidationMarkupBs
          .create(req.body);

        res.status(200)
          .send(markup);
      } catch (err) {
        next(err);
      }
    },

    getLastMarkup: async (req, res, next) => {
      const documentValidationMarkupBs = req.scope
        .resolve('documentValidationMarkupBs');
      try {
        let markup = await documentValidationMarkupBs
          .getLastMarkup(req.body);
        res.status(200)
          .send(markup);
      } catch (err) {
        next(err);
      }
    }
  };
};
