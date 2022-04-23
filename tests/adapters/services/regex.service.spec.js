require('should');
const sinon = require('sinon');
const RegexService = require('../../../app/adapters/services/regex.service');

const params = {
  re2: sinon.stub()
};

let service;

describe('RegexService', () => {

  beforeEach(() => {
    service = new RegexService(params);
  });

  describe('build()', () => {
    it('should return the current date', () => {
      let pattern = '[a-z]';
      let flags = 'gm';
      let regex = /[a-z]/;

      params.re2.withArgs(pattern, flags).returns(regex, flags);

      let result = service.build(pattern, flags);
      result.should.eql(regex);
    });
  });

});
