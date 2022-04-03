'use strict';

module.exports = () => {
  return async (req, res, next) => {
    const authenticateBs = req.scope
      .resolve('authenticateBs');

    const gisLogsBs = req.scope
      .resolve('gisLogsBs');

    if (!req.headers.authorization) {
      const errorService = req.scope.resolve('errorService');
      let error = errorService.get('fail_to_authenticate_token');

      gisLogsBs.saveLog(req);

      error.status = 401;
      return next(error);
    }

    const accessToken = req.headers.authorization
      .split(' ')[1];

    try {
      req.key = await authenticateBs
        .execute(accessToken, req.route.path);

      await gisLogsBs.saveLog(req);

      next();
    } catch (err) {
      err.status = 401;
      gisLogsBs.saveLog(req);
      next(err);
    }
  };
};
