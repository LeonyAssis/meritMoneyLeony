'use strict';

module.exports = () => {
  return async (req, res, next) => {

    const authenticateBs = req.scope
      .resolve('authenticateBs');

    if (!req.headers.authorization) {
      const errorService = req.scope.resolve('errorService');
      let err = errorService.get('fail_to_authenticate_token');
      err.status = err.extra.statusCode;
      return next(err);
    }
    const accessToken = req.headers.authorization
      .split(' ')[1];

    try {
      req.key = await authenticateBs
        .execute(accessToken, req.route.path);
      next();
    } catch (err) {
      err.status = err.extra.statusCode;
      next(err);
    }
  };
};
