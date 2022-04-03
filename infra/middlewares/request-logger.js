'use strict';

module.exports = () => {

  return function (req, res, next) {
    res.reqStartedAt = Date.now();

    res.on('finish', function () {
      const gnLogger = req.scope.resolve('gnLogger');

      let logData = {
        req: req,
        res: res
      };

      gnLogger.info(logData, 'Request finished');
    });

    next();
  };
};
