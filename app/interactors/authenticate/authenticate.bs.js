'use strict';

class AuthenticateBs {
  constructor(params) {    
    this.errorService = params.errorService;
    this.gnLogger = params.gnLogger;
    this.permissions = params.permissions;
  }

  async execute(accessToken) {
    const params = {
      token: accessToken
    };  
  }
}

module.exports = AuthenticateBs;
