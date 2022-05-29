'use strict';

module.exports = () => {

  return {
    createUser: async (req, res, next) => {
      const userBs = req.scope.resolve('userBs');

      try {
        await userBs.createUser(req);
        res.sendStatus(204);

      } catch (error) {
        next(error);
      }
    },

    getUsers: async (req, res, next) => {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      const userBs = req.scope.resolve('userBs');

      try {
        const users = await userBs.getUsers(req);

        res.status(200)
          .send({
            users: users.rows,
            currentPage: page,
            pages: Math.ceil(users.count / limit),
            numOfResults: users.count,
            limit: limit
          });
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
    },

    updateUser: async (req, res, next) => {
      const userBs = req.scope.resolve('userBs');

      try {
        await userBs.updateUser(req);
        res.sendStatus(204);

      } catch (error) {
        next(error);
      }
    }





  };
};
