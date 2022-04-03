'use strict';

module.exports = () => {
  return {
    list_by_manager: async (req, res, next) => {
      const callHistoryManagersBs = req.scope
        .resolve('callHistoryManagersBs');

      try {
        let users = await callHistoryManagersBs
          .list_by_manager(req);

        res.status(200)
          .send(users);
      } catch (err) {
        next(err);
      }
    }

  };
};
