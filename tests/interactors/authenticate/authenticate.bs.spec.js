'use strict';

require('should-sinon');
const sinon = require('sinon');
const AuthenticateBs = require('../../../app/interactors/authenticate/authenticate.bs');
const jwt = require('jsonwebtoken');
let authenticateBs;
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NjM5ODUwNDAsImV4cCI6MTY2Mzk4ODY0MH0.w98BVeNRe4CWme69Ky4upCzWUSbrKuxnRy9nPSU97o8';

const params = {
  errorService: {
    get: sinon.stub()
  },
  gnLogger: {
    error: sinon.stub()
  },
  jwt
};

describe('authenticate business', () => {
  beforeEach(() => {
    sinon.reset();
    authenticateBs = new AuthenticateBs(params);
  });

  it('reject verify token', async () => {
    try {
      jwt.verify;
      await authenticateBs
        .execute(accessToken);
    } catch (error) {
      console.log(error);
    }
  });
 

});
