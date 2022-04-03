'use strict';

module.exports = () => {
  return {
    address_info_by_zipcode: async (req, res, next) => {
      const correiosBs = req.scope
        .resolve('correiosBs');
      try {
        let response = await correiosBs
          .addressInfoByZipcode(req);
        res.status(200)
          .send(response);
      } catch (err) {
        next(err);
      }
    },

    clientSearch: async (req, res) => {
      const correiosBs = req.scope
        .resolve('correiosBs');
      try {
        let response = await correiosBs
          .clientSearch(req);
        res.status(200)
          .send(response);
      } catch (err) {
        res.status(400)
          .end('400:360');
      }
    }
  };
};
