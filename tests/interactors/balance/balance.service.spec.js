'use strict';

const sinon = require('sinon');
const BalanceService = require(
  '../../../app/interactors/balance/balance.service'
);

describe('balanceService', () => {
  let balanceService;

  const Op = {
    ne: '$ne',
    gt: '$gt',
    lt: '$lt',
    lte: '$gte',
  };

  const params = {
    balanceRepository: {
      getBalanceAndUser: sinon.stub(),
    },
    validatorService: {
      execute: sinon.stub()
    },
    errorService: {
      get: sinon.stub()
    },
    sequelize: {
      Sequelize: {
        Op: Op  
      }
    }
  };

  beforeEach(() => {
    sinon.reset();
    balanceService = new BalanceService(params);
  });

  describe('checkUsersAndBalance()', () => {
    it('should throw error owner or balance not found', async () => {
      try {
        await balanceService.checkUsersAndBalance({});
        return fail();
      } catch (error) {
        params.errorService
          .get
          .should
          .calledWith('owner_or_balance_not_found');
      }
    });

    it('should throw error receiver or balance not found', async () => {
      params.balanceRepository
        .getBalanceAndUser
        .onCall(0).returns({ balance: 5, user: { name: 'test' } });

      params.balanceRepository
        .getBalanceAndUser
        .onCall(1).returns(null);

      try {
        await balanceService.checkUsersAndBalance({});
        return fail();
      } catch (error) {
        params.errorService
          .get
          .should
          .calledWith('receiver_or_balance_not_found');
      }
    });

    it('should throw owner does not have enough balance', async () => {
      params.balanceRepository
        .getBalanceAndUser
        .onCall(0).returns({ balance: 500, user: { name: 'test' } });

      params.balanceRepository
        .getBalanceAndUser
        .onCall(1).returns({ balance: 5, user: { name: 'test' } });

      try {
        await balanceService.checkUsersAndBalance(50, 10, 3000);
        return fail();
      } catch (error) {
        params.errorService
          .get
          .should
          .calledWith('owner_does_not_have_enough_balance');
      }
    });

    it('should throw owner does not have enough balance', async () => {
      params.balanceRepository
        .getBalanceAndUser
        .onCall(0).returns({ balance: 500, user: { name: 'test' } });

      params.balanceRepository
        .getBalanceAndUser
        .onCall(1).returns({ balance: 5, user: { name: 'test' } });

      await balanceService.checkUsersAndBalance(50, 10, 50);
    });
  });

  describe('getParametersList()', () => {

    it('format parameters list without any change', async () => {  
      await balanceService.getParametersList({});
    });

    it('format parameters list with change', async () => {  
      await balanceService.getParametersList({column: 'created_at', searchOrigin: 'test', searchDestiny: 'jupira'});
    });

    it('format parameters list with change order == asc', async () => {  
      await balanceService.getParametersList({column: 'created_at', searchOrigin: 'test', searchDestiny: 'jupira', order: 'asc'});
    });
  });
});
