'use strict';

const sinon = require('sinon');
const fail = require('../../fail');
const AuthBs = require(
  '../../../app/interactors/token/auth.bs'
);

let authBs;

const params = {
  errorService: {
    get: sinon.stub()
  },
  userRepository: {
    getUserAndPassword: sinon.stub(),
  },
  bcrypt: {
    compareSync: sinon.stub(),
  },
  jwt: {
    sign: sinon.stub(),
  }
};

describe('AuthBs', () => {

  beforeEach(() => {
    sinon.reset();
    authBs = new AuthBs(params);
  });


  describe('generateToken()', () => {
    it('should throw error login and password required', async () => {
      try {
        await authBs.generateToken({ headers: { authorization: 'Bearer: ' } });

      } catch (error) {
        params.errorService
          .get
          .should
          .calledWith('login_and_password_required');
      }
    });

    it('should throw error login or password incorrect', async () => {
      params.userRepository
        .getUserAndPassword
        .resolves(null)

      try {
        await authBs.generateToken({ headers: { authorization: 'Basic aGFzaEBvdXRsb29rLmNvbS5icjo2NTQxMjM=' } });

      } catch (error) {
        params.errorService
          .get
          .should
          .calledWith('login_or_password_incorrect');
      }
    });

    it('should throw error login or password incorrect (user has checked twice)', async () => {
      params.userRepository
        .getUserAndPassword
        .resolves({ id: 5, email: 'hash@outlook.com.br' })

      try {
        await authBs.generateToken({ headers: { authorization: 'Basic aGFzaEBvdXRsb29rLmNvbS5icjo2NTQxMjM=' } });
      } catch (error) {
        params.errorService
          .get
          .should
          .calledWith('login_or_password_incorrect');
      }
    });

    it('should return jwt token', async () => {
      params.userRepository
        .getUserAndPassword
        .resolves({ id: 5, email: 'hash@outlook.com.br' })

      params.bcrypt
        .compareSync
        .resolves(true)

      params.jwt
      .sign
      .resolves('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NjM5NzM1NzIsImV4cCI6MTY2Mzk3NzE3Mn0.W59zRJft2wW4b7YOgfJWCWruN0PaP2ERDJHsye9ffFQ')

      await authBs.generateToken({ headers: { authorization: 'Basic aGFzaEBvdXRsb29rLmNvbS5icjo2NTQxMjM=' } });

    });
  });



});
