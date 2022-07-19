'use strict';

module.exports = (err, req, res, next) => { 
  const gnLogger = req.scope.resolve('gnLogger');
  const errorService = req.scope.resolve('errorService');

  res.status(err.status || 500);

  delete err.status;
  delete err.extra.statusCode;

  if (err.name !== 'MMError') {
    gnLogger.error(err, 'Unhandled error');
    err = errorService.get('server_error');
  } else {
    gnLogger.error(err, 'GnError');   
  }

  res.json({
    error: err
  });
};
