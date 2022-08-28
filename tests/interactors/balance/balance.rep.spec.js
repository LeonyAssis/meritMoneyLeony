'use strict';

const sinon = require('sinon');
const BalanceRepository = require(
  '../../../app/interactors/balance/balance.rep'
);

describe('balanceRepository', () => {
  let balanceRepository;

  const params = {
    sequelize: {
      main: {
        balance: {
          findOne: sinon.stub(),
          create: sinon.stub(),
          update: sinon.stub(),
          findAll: sinon.stub(),
        },
        balance_history: {
          create: sinon.stub(),
        },
        users: {}
      },
    },
  };

  beforeEach(() => {
    sinon.reset();
    balanceRepository = new BalanceRepository(params);
  });

  describe('getBalance()', () => {
    it('should getBalance', async () => {
      await balanceRepository
        .getBalance(14);
    });
  });

  describe('createBalance()', () => {
    it('should createBalance', async () => {
      await balanceRepository
        .createBalance({ balance: 1400, user_id: 8 });
    });
  });

  describe('getBalanceAndUser()', () => {
    it('should get Balance And User', async () => {
      await balanceRepository
        .getBalanceAndUser(31);
    });
  });

  describe('getBalanceAndUsers()', () => {
    it('should get Balance And User', async () => {
      await balanceRepository
        .getBalanceAndUsers();
    });
  });


  describe('updateBalance()', () => {
    it('should update Balance', async () => {
      await balanceRepository
        .updateBalance(1, { balance: 5000 });
    });
  });

  describe('updateUserBalance()', () => {
    it('should update User Balance', async () => {
      await balanceRepository
        .updateUserBalance(50, { balance: 5000 });
    });
  });

  // describe('createBalanceHistory()', () => {
  //   it('should update User Balance', async () => {
  //     await balanceRepository
  //       .createBalanceHistory({ user_id: 22, automatic_balance_id: 2 });
  //   });
  // });



});
