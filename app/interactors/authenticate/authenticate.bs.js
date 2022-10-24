'use strict';

class AuthenticateBs {
  constructor(params) {
    this.errorService = params.errorService;
    this.gnLogger = params.gnLogger;
    this.jwt = params.jwt;
  }

  async execute(accessToken) {    
    return this.jwt.verify(accessToken, process.env.SECRET_KEY, (err, decodeToken) => {             
      if (err) {
        throw this.errorService
          .get('access_denied');
      }          
      return decodeToken;
    });
  }
}

module.exports = AuthenticateBs;
