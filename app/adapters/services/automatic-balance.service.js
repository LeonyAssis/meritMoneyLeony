'use strict';
var CronJob = require('cron').CronJob;

class AutomaticBalanceService {
  initialize(automaticBalanceBs) {
    new CronJob(
      '* 0 */12 * * *',
      async function () { 
        console.log('Running Cron Balance');
        const config = await automaticBalanceBs.getConfig();        
        const day = new Date().getDate();
        const dayToSend = config.day_to_send_balance || 1;
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth());
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 20, 59, 59);

        const executionInMonth = await automaticBalanceBs
          .getAutomaticBalanceExecutionStatus(firstDayOfMonth, lastDayOfMonth);

        if (day === dayToSend || !executionInMonth)
          await automaticBalanceBs.skipOrExecuteAutomaticBalance(config);
      },
      null,
      true,
      'America/Sao_Paulo'
    );
  }


}



module.exports = AutomaticBalanceService;


// var CronJob = require('cron').CronJob;




//  CRIAR SINGLETON
var job = new CronJob(
  '0 1 12 30 * *',
  async function () {
    const config = await this.automaticBalanceBs.getConfig();
    const day = new Date().getDate();
    const dayToSend = config.day_to_send_balance || 1;
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth());
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 20, 59, 59);

    const executionInMonth = await this.automaticBalanceBs
      .getAutomaticBalanceExecutionStatus(firstDayOfMonth, lastDayOfMonth);

    if (day === dayToSend || !executionInMonth)
      this.automaticBalanceBs.skipOrExecuteAutomaticBalance(config);

  },
  null,
  true,
  'America/Sao_Paulo'
);

