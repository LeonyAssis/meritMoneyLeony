'use strict';

module.exports = (app, ctrls, mdws) => {
 
    app.route('/balance/:userId([0-9]{1,30})')
    .get(
      mdws.authorize,
      ctrls.balanceController.getBalance
    );

    app.route('/balance/transfer-money')
    .post(
      mdws.authorize,
      ctrls.balanceController.transferMoney
    );

    
    app.route('/balance/histories/')
    .get(
      mdws.authorize,
      ctrls.balanceController.getBalanceHistories
    );

  
};
