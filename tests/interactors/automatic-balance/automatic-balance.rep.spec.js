'use strict';

const sinon = require('sinon');
const AutomaticBalanceRepository = require(
  '../../../app/interactors/automatic-balance/automatic-balance.rep'
);

describe('automaticBalanceRepository', () => {
  let automaticBalanceRepository;
  
  const Op = {
    ne: '$ne',
    gt: '$gt',
    lt: '$lt',
    lte: '$gte',
  };
  const params = {
    sequelize: {
      Sequelize: {
        Op: Op
      },
      main: {   
        automatic_balance_execution_status: {
          findOne: sinon.stub(),
        },
        automatic_balance_config: {       
          findOne: sinon.stub(),  
        }
      },
    },
  };

  beforeEach(() => {
    sinon.reset();
    automaticBalanceRepository = new AutomaticBalanceRepository(params);
  });

  describe('automaticBalanceRepository', () => {
    it('should get config', async () => {
      await automaticBalanceRepository
        .getConfig();
    });

    it('should get AutomaticBalanceExecutionStatus', async () => {
      await automaticBalanceRepository
        .getAutomaticBalanceExecutionStatus('2022-08-01', '2022-08-31');
    });   
  });
});
