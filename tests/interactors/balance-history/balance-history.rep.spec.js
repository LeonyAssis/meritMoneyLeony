'use strict';

const sinon = require('sinon');
const BalanceHistoryRepository = require(
  '../../../app/interactors/balance-history/balance-history.rep'
);

describe('balanceHistoryRepository', () => {
  let balanceHistoryRepository; 

  const params = {
    sequelize: {    
      main: {
        balance_history: {
          create: sinon.stub(), 
          findAndCountAll: sinon.stub(),         
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

    it('should create Balance History transaction true', async () => {
      await balanceHistoryRepository
        .createBalanceHistory({}, true);
    });   
  });

  describe('getBalanceHistories()', () => {
    it('should get Balance Histories without filters', async () => {
      await balanceHistoryRepository
        .getBalanceHistories({}, {}, {}, {}, {});
    });   
  });
});
