'use strict';

module.exports = (container, asValue) => {
  const uuid = container.resolve('uuid');

  return (req, res, next) => {
    let requestId = req.headers['x-request-id'] || uuid.v4();

    req.id = requestId;
    req.scope = container.createScope();

    req.scope.register({
      requestId: asValue(requestId)
    });

    next();
  };
};
