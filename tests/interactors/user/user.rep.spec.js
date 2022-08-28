'use strict';

const sinon = require('sinon');
const UserRepository = require(
  '../../../app/interactors/user/user.rep'
);

describe('userRepository', () => {
  let userRepository;

  const params = {
    sequelize: {
      main: {
        users: {
          create: sinon.stub(),
          findAndCountAll: sinon.stub(),
          findOne: sinon.stub(),
          update: sinon.stub(),
        },
      },
    },
  };

  beforeEach(() => {
    sinon.reset();
    userRepository = new UserRepository(params);
  });

  describe('createUser()', () => {
    it('should createUser', async () => {
      await userRepository
        .createUser({ name: 'John', email: 'james@test.com' });
    });
  });

  describe('getUsers()', () => {
    it('should getUsers', async () => {
      await userRepository
        .getUsers({}, {}, {});
    });
  });

  describe('getUser()', () => {
    it('should getUser', async () => {
      await userRepository
        .getUser({ id: 14 });
    });
  });

  describe('updateUser()', () => {
    it('should getUsers', async () => {
      await userRepository
        .updateUser(11,{ active: 'false' });
    });
  });

  describe('getUserAndPassword()', () => {
    it('should getUserAndPassword', async () => {
      await userRepository
        .getUserAndPassword({ active: 'true' });
    });
  });
});
