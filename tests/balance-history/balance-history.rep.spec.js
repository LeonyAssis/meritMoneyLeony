'use strict';

const sinon = require('sinon');
const BalanceHistoryRepository = require(
  '../../app/interactors/balance-history/balance-history.rep'
);

describe('balanceHistoryRepository', () => {
  let balanceHistoryRepository; 

  const params = {
    sequelize: {    
      main: {
        balance_history: {
          create: sinon.stub(),         
        },     
      },
    },
  };

  beforeEach(() => {
    sinon.reset();
    balanceHistoryRepository = new BalanceHistoryRepository(params);
  });

  describe('createBalanceHistory()', () => {

    it('should create Balance History', async () => {
      await balanceHistoryRepository
        .createBalanceHistory();
    });

   
  });
});
