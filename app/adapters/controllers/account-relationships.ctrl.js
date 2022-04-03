'use strict';

module.exports = () => {
  return {
    get: async (req, res, next) => {
      const accountRelationshipsBs = req.scope
        .resolve('accountRelationshipsBs');

      try {
        let accountRelationships = await accountRelationshipsBs
          .get(req);
        res.status(200)
          .send(accountRelationships);
      } catch (err) {
        next(err);
      }
    },


  };
};
