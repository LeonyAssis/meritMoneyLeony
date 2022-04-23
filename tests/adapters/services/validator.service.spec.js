'use strict';

require('should');
const sinon = require('sinon');
const ValidatorService = require('../../../app/adapters/services/validator.service');


describe('validator service', () => {
  let validatorService;
  let validateSchemaStub;
  let schemaStub;
  let errorServiceStub;

  beforeEach(() => {
    validateSchemaStub = sinon.stub();

    schemaStub = {
      for: () => {
        return validateSchemaStub;
      }
    };
    errorServiceStub = {
      get: sinon.stub()
    };

    validatorService = new ValidatorService({
      errorService: errorServiceStub,
      schema: schemaStub
    });
  });

  it('should call schema validation with correct parameters', () => {
    const spy = sinon.spy(schemaStub, 'for');
    validateSchemaStub.returns(true);

    validatorService.execute('myschema.json', { user: 1 });

    schemaStub.for.should.have.been.calledWith('myschema.json');
    validateSchemaStub.should.have.been.calledWith({ user: 1 });

    spy.restore();
  });

  it('should throw error when schema validation fails [1]', () => {
    validateSchemaStub.callsFake(() => {
      schemaStub.for = () => {
        return {
          errors: [{
            keyword: 'required',
            dataPath: '',
            schemaPath: '#/required',
            params: {
              missingProperty: 'registration'
            },
            message: 'should have required property \'registration\''
          }]
        };
      };
      return false;
    });

    try {
      validatorService.execute('myschema.json', { user: 1 });
    } catch (_) {
      errorServiceStub.get
        .should.have.been
        .calledWith('validation_error', 'should have required property \'registration\'', {
          type: 'required',
          path: '',
          meta: {
            missingProperty: 'registration'
          }
        });
    }
  });

  it('should throw error when schema validation fails [2]', () => {
    validateSchemaStub.callsFake(() => {
      schemaStub.for = () => {
        return {
          errors: [{
            keyword: 'required',
            dataPath: '.not-empty',
            schemaPath: '#/required',
            params: {
              missingProperty: 'registration'
            },
            message: 'should have required property \'registration\''
          }]
        };
      };
      return false;
    });

    try {
      validatorService.execute('myschema.json', { user: 1 });
    } catch (_) {
      errorServiceStub.get
        .should.have.been
        .calledWith('validation_error', 'not-empty should have required property \'registration\'', {
          type: 'required',
          path: '.not-empty',
          meta: {
            missingProperty: 'registration'
          }
        });
    }
  });

  it('should throw default error when schema validation returns empty array', () => {
    validateSchemaStub.callsFake(() => {
      schemaStub.for = () => {
        return {
          errors: []
        };
      };
      return false;
    });

    try {
      validatorService.execute('myschema.json', { user: 1 });
    } catch (_) {
      errorServiceStub.get
        .should.have.been
        .calledWith('validation_error', 'DEFAULT MESSAGE: supplied parameters are not valid', undefined);
    }
  });
});
