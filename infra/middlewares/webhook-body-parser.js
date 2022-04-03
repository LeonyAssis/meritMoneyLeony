'use strict';

module.exports = () => {
  return async (req, res, next) => {
    if (!req.body.toString) {
      res.status(500)
        .end();
    }

    const rawBody = req.body.toString();
    try {
      req.body.data = JSON.parse(rawBody);
    } catch (error) {
      req.body = {
        data: rawBody
      };
    }

    next();
  };
};
