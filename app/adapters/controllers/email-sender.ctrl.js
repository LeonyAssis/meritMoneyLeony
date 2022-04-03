'use strict';

module.exports = () => {
  return {
    run: async (req, res, next) => {
      const emailSenderBs = req.scope.resolve('emailSenderBs');

      try {
        await emailSenderBs
          .execute();

        res.status(200)
          .end('200');
      } catch (err) {
        next(err);
      }
    }
  };
};
