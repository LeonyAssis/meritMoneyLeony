'use strict';

require('should-sinon');
const sinon = require('sinon');
const AuthenticateBs = require('../../../app/interactors/authenticate/authenticate.bs');

let authenticateBs = null;

const accessToken = 'token';

const params = {
  errorService: {
    get: sinon.stub()
  },
  gnLogger: {
    error: sinon.stub()
  },
};

describe('authenticate business', () => {
  beforeEach(() => {
    sinon.reset();
    authenticateBs = new AuthenticateBs(params);
  });

  it('should call execute with success', async () => {
    await authenticateBs
      .execute(accessToken);
  });

});
