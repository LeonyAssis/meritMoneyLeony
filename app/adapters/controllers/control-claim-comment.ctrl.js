'use strict';

module.exports = () => {
  return {
    create: async (req, res, next) => {
      const controlClaimCommentBs = req.scope
        .resolve('controlClaimCommentBs');

      try {
        await controlClaimCommentBs
          .create(req);
        res.status(200)
          .send('200');
      } catch (err) {
        next(err);
      }
    },

    listByClaim: async (req, res, next) => {
      const controlClaimCommentBs = req.scope
        .resolve('controlClaimCommentBs');

      try {
        let comments = await controlClaimCommentBs.
          listByClaim(req.params.id);

        res.status(200)
          .send(comments);
      } catch (err) {
        next(err);
      }
    }

  };
};
