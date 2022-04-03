'use strict';

module.exports = () => {
  return {
    send: async (req, res, next) => {
      const whatsappBs = req.scope
        .resolve('whatsappBs');

      try {
        await whatsappBs
          .send(req);

        res.status(200)
          .send(200);
      } catch (err) {
        next(err);
      }
    }
  };
};
