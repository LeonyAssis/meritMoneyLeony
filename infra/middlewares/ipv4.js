'use strict';

module.exports = (container) => {

  return async (req, res, next) => {
    const extractIpv4Bs = container
      .resolve('extractIpv4Bs');

    const ip = await extractIpv4Bs
      .run(req.headers, req.ip);

    req.ipv4 = ip;

    next();
  };
};
