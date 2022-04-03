'use strict';

module.exports = () => {
  return async (req, res, next) => {
    const regexService = req.scope.resolve('regexService');
    const ip = req.ipv4;

    if (regexService.build('^10\\.([0-9]{1,3})\\.([0-9]{1,3})\\.([0-9]{1,3})').test(ip) ||
      regexService.build('^192\\.168\\.([0-9]{1,3})\\.([0-9]{1,3})') ||
      regexService.build('^172\\.(1[6-9]|2\\d|30|31)\\.([0-9]{1,3})\\.([0-9]{1,3})') ||
      regexService.build('^127\\.([0-9]{1,3})\\.([0-9]{1,3})\\.([0-9]{1,3})') ||
      regexService.build('^169\\.254\\.([0-9]{1,3})\\.([0-9]{1,3})')) {

      next();
    }
    else {
      res.status(503).end();
    }
  };
};
