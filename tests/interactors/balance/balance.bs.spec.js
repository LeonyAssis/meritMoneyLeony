'use strict';

const sinon = require('sinon');
const fail = require('../../fail');
const BalanceBs = require(
  '../../../app/interactors/balance/balance.bs'
);


let balanceBs;

const params = {
  userBs: {
    getUser: sinon.stub(),
  },
  balanceRepository: {
    getBalance: sinon.stub(),
    createBalance: sinon.stub(),
    updateBalance: sinon.stub(),
  },
  balanceHistoryRepository: {
    createBalanceHistory: sinon.stub(),
  },
  balanceService: {
    checkUsersAndBalance: sinon.stub()
  },
  transactionService: {
    startTransaction: sinon.stub(),
    commitTransaction: sinon.stub(),
    rollbackTransaction: sinon.stub()
  },
  validatorService: {
    execute: sinon.stub()
  },
  errorService: {
    get: sinon.stub()
  },
  formatService: {
    formatObjectByProperty: sinon.stub()
  }
};

describe('BalanceBs', () => {

  beforeEach(() => {
    sinon.reset();
    balanceBs = new BalanceBs(params);
  });


  describe('getBalance()', () => {
    it('Should get balance for an user', async () => {

      params.userBs
        .getUser
        .resolves({ id: 99 });

      params.balanceRepository
        .getBalance
        .resolves({ id: 14 });

      await balanceBs.getBalance({ params: { userId: 10 } });
    });
  });

  describe('transferMoney()', () => {
    it('Should transfer Money between users', async () => {

      params.balanceService
        .checkUsersAndBalance
        .resolves({ balanceOwner: { id: 30, balance: 990 }, balanceReceiver: { id: 33, balance: 5000 } });

      params.balanceRepository
        .getBalance
        .resolves({ id: 14 });

      await balanceBs.transferMoney({ body: { owner: 10, sendTo: 11, value: 500 } });
    });

    it('Should rollback transaction', async () => {

      params.balanceService
        .checkUsersAndBalance
        .resolves({ balanceOwner: { id: 30, balance: 990 }, balanceReceiver: { id: 33, balance: 5000 } });

      params.balanceRepository
        .getBalance
        .resolves({ id: 14 });

      params.balanceRepository
        .updateBalance
        .throws(new Error);

      try {
        await balanceBs.transferMoney({ body: { owner: 10, sendTo: 11, value: 500 } });
      } catch (error) {
        console.log(error);
      }

    });
  });





});
