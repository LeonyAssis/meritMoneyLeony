'use strict';

const sinon = require('sinon');
const fail = require('../../fail');
const UserBs = require(
  '../../../app/interactors/user/user.bs'
);


let userBs;

const params = {
  userRepository: {
    createUser: sinon.stub(),
    getUsers: sinon.stub(),
    getUser: sinon.stub(),
    updateUser: sinon.stub(),
  },
  balanceRepository: {
    createBalance: sinon.stub(),
    updateUserBalance: sinon.stub(),
  },
  userService: {
    getParametersList: sinon.stub(),
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

describe('UserBs', () => {

  beforeEach(() => {
    sinon.reset();
    userBs = new UserBs(params);
  });


  describe('createUser()', () => {
    it('Should throw when the request isnt a valid json', async () => {
      params.validatorService.execute.throws();
      try {
        await userBs.createUser({});
        return fail();
      } catch (error) {
        params.validatorService.execute
          .calledWith('users.json')
          .should.be.true();
      }
    });

    it('Should throw when the transaction fail', async () => {
      params.userRepository
        .createUser
        .throws(new Error());

      try {
        await userBs.createUser({});
      } catch (error) {
        console.log(error);
      }
    });

    it('Should create user', async () => {
      params.userRepository
        .createUser
        .resolves({ dataValues: { id: 10 } });

      await userBs.createUser({});
    });
  });

  describe('getUsers()', () => {
    it('Should create user', async () => {
      params.userService
        .getParametersList
        .resolves({}, {}, {});
      await userBs.getUsers({ query: { columns: 'created_at', order: 'asc', page: 2 } });
    });
  });

  describe('getUser()', () => {
    it('Should throw error id required', async () => {
      try {
        await userBs.getUser({ params: {} });
        return fail();
      } catch (error) {
        params.errorService
          .get
          .should
          .calledWith('id_required');
      }
    });

    it('Should throw error user not found', async () => {
      params.userRepository
        .getUser
        .resolves(null);

      try {
        await userBs.getUser({ params: { id: 10 } });
        return fail();
      } catch (error) {
        params.errorService
          .get
          .should
          .calledWith('user_not_found');
      }
    });

    it('Should get user by id', async () => {
      params.userRepository
        .getUser
        .resolves({ id: 14, name: 'Test' });

      await userBs.getUser({ params: { id: 10 } });
    });

    it('Should get userId', async () => {
      params.userRepository
        .getUser
        .resolves({ id: 14, name: 'Test' });

      await userBs.getUser({ params: { userId: 10 } });
    });
  });


  describe('updateUser()', () => {
    params.userRepository
      .getUser
      .resolves(null);

    it('Should throw error user not found', async () => {
      try {
        await userBs.updateUser({ params: { userId: 14 }, body: {} });
        return fail();
      } catch (error) {
        params.errorService
          .get
          .should
          .calledWith('user_not_found');
      }
    });

    it('Should update user', async () => {
      params.userRepository
        .getUser
        .resolves({ id: 15, name: 'test', status: 'active' });   

      await userBs.updateUser({ params: { userId: 14 }, body: {status: 'false'} });
    });


  });



});
