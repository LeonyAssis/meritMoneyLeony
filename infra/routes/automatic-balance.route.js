'use strict';

module.exports = (app, ctrls, mdws) => { 
 
    app.route('/automatic-balance/config')
    .get(
      // mdws.authorize,
      ctrls.automaticBalanceController.getConfigBalance
    );

    app.route('/automatic-balance/config')
    .put(
      // mdws.authorize,
      ctrls.automaticBalanceController.updateConfigBalance
    );
  
};
