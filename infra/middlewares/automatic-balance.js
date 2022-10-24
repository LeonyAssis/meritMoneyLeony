'use strict';

module.exports = () => {
  return async (req, res, next) => {
    const automaticBalanceBs = req.scope
      .resolve('automaticBalanceBs');

    if (!req.url.includes('automatic-balance')) {     
      const config = await automaticBalanceBs.getConfig();
      const day = new Date().getDate();
      const dayToSend = config.day_to_send_balance || 1;
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth());
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 20, 59, 59);    

      const executionInMonth = await automaticBalanceBs
        .getAutomaticBalanceExecutionStatus(firstDayOfMonth, lastDayOfMonth);

      if (day === dayToSend || !executionInMonth)
        automaticBalanceBs.skipOrExecuteAutomaticBalance(config);
    }
    next();
  };
};