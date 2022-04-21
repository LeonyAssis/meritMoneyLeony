'use strict';

module.exports = () => {
  return async (req, res, next) => {   
    const automaticBalanceBs = req.scope
      .resolve('automaticBalanceBs');

    const config = await automaticBalanceBs.getConfig();    
    const day = new Date().getDate();
    const dayToSend = config.day_to_send_balance || 1;   

    if(day === dayToSend)     
      automaticBalanceBs.skipOrExecuteAutomaticBalance(config); 
  
    next();
  };
};