'use strict';

require('should-sinon');
const sinon = require('sinon');
const ErrorService = require('../../../app/adapters/services/error.service');

describe('error service', () => {
  let errorService;
  let util;
  let immutable;
  let logger;
  let errors;

  beforeEach(() => {
    util = {
      format: sinon.stub().returns('could not authenticate world')
    };

    immutable = {
      Map: (item) => {
        return item;
      }
    };

    logger = {
      error: sinon.stub()
    };

    errors = [
      {
        code: 3400000,
        name: 'unauthorized',
        message: 'could not authenticate', 
        statusCode: 500
      },
      {
        code: 3400001,
        name: 'unauthorized_1',
        message: '%s', 
        statusCode: 500
      }
    ];

    errorService = new ErrorService({ util, immutable, logger, errors });
  });

  describe('initialize', () => {
    it('should initialize errors objects as immutables', () => {
      errorService.errors.should.eql({});

      const spy = sinon.spy(immutable, 'Map');

      errorService.initialize();

      errorService.errors.should.eql({
        [errors[0].name]: errors[0],
        [errors[1].name]: errors[1]
      });

      spy.should.calledTwice();
    });
  });

  describe('get', () => {
    beforeEach(() => {
      const error0 = Object.assign(errors[0], {
        toObject: () => error0,
        get: () => errors[0].message,
      });

      error0.set = (p, m) => {
        error0[p] = m;
        return error0;
      };

      const error1 = Object.assign(errors[1], {
        toObject: () => errors[1],
        get: () => errors[1].message,
      });

      error1.set = (p, m) => {
        error1[p] = m;
        return error1;
      };

      errorService.errors = {
        [errors[0].name]: error0,
        [errors[1].name]: error1
      };
    });

    it('should get an error without params', () => {
      const error = errorService.get('unauthorized');

      error.name.should.eql('MMError');
      error.should.instanceof(Error);
      error.extra.code.should.eql(3400000);
      error.extra.name.should.eql('unauthorized');
      error.extra.statusCode.should.eql(500);
      error.extra.message.should.eql('could not authenticate');
    });

    it('should get an error with params', () => {
      const error = errorService.get('unauthorized_1', 'world');

      error.name.should.eql('MMError');
      error.should.instanceof(Error);
      error.extra.code.should.eql(3400001);
      error.extra.name.should.eql('unauthorized_1');
      error.extra.statusCode.should.eql(500);
      error.extra.message.should.eql('could not authenticate world');
    });

    it('should get an error with extra', () => {
      const error = errorService.get('unauthorized_1', null, { id: 1 });

      error.name.should.eql('MMError');
      error.should.instanceof(Error);
      error.extra.code.should.eql(3400001);
      error.extra.name.should.eql('unauthorized_1');
      error.extra.statusCode.should.eql(500);
      error.extra.message.should.eql('%s');
      error.extra.extra.should.eql({ id: 1 });
    });
  });

});
