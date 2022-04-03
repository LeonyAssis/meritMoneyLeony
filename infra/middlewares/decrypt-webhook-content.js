'use strict';

module.exports = () => {
  return async (req, res, next) => {
    const logger = req.scope
      .resolve('gnLogger');

    const webhookDecryptBs = req.scope
      .resolve('webhookDecryptBs');

    const encryptedData = req.body.data;

    try {

      const webhookContent = await webhookDecryptBs.execute(encryptedData);

      req.webhookContent = webhookContent;

      next();

    } catch (err) {

      logger
        .error(err);

      return res.status(403)
        .end('Forbidden');
    }
  };
};
