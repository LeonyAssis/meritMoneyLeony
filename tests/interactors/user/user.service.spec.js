'use strict';

const sinon = require('sinon');
const UserService = require(
  '../../../app/interactors/user/user.service'
);

describe('userService', () => {
  let userService;
  const literal = String;
  const like = String;

  const Op = {
    ne: '$ne',
    gt: '$gt',
    lt: '$lt',
    lte: '$gte',
  };

  const params = {
    sequelize: {
      Sequelize: {
        Op: Op,
        literal: literal,
        like: like
      }
    }
  };

  const reqColumn = {
    column: 'created_at',
  };

  beforeEach(() => {
    sinon.reset();
    userService = new UserService(params);
  });

  describe('getParametersList()', () => {
    it('should get the parameters without any filter', async () => {
      await userService
        .getParametersList({});
    });

    it('should get the parameters with filter', async () => {
      await userService
        .getParametersList({ column: 'created_at', order: 'desc' });
    });

    it('should get the parameters with filter order asc', async () => {
      await userService
        .getParametersList({ column: 'created_at', order: 'asc', active: true, search: 'james@test.com' });
    });

    it('should get the parameters with filter name', async () => {
      await userService
        .getParametersList({ column: 'created_at', order: 'asc', active: true, name: 'Bond' });
    });


  });





});
