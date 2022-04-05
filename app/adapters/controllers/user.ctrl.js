'use strict';

module.exports = () => {

  return {
    createUser: async (req, res, next) => {
      const userBs = req.scope.resolve('userBs');

      try {
        await userBs.createUser(req);

        res.send()
          .status(200);

      } catch (error) {
        next(error);
      }
    },

    getUsers: async (req, res, next) => {
      const userBs = req.scope.resolve('userBs');

      try {
        const users = await userBs.getUsers(req);

        res.send(users)
          .status(200);
      } catch (error) {
        next(error);
      }
    },

    getUser: async (req, res, next) => {
      const userBs = req.scope.resolve('userBs');

      try {
        const users = await userBs.getUser(req);

        res.send(users)
          .status(200);
      } catch (error) {
        next(error);
      }
    }





  };
};
