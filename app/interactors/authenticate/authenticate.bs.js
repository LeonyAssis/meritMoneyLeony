'use strict';

class AuthenticateBs {
  constructor(params) {
    this.authServerSdk = params.authServerSdk;
    this.errorService = params.errorService;
    this.gnLogger = params.gnLogger;
    this.permissions = params.permissions;
  }

  async execute(accessToken, path) {
    const params = {
      token: accessToken
    };

    const authenticate = async (params, path) => {
      try {
        const key = await this.authServerSdk
          .authenticate(params);

        if (!this.permissions[key.organization_id] || !this.permissions[key.organization_id].services[path]) {
          throw this.errorService
            .get('organization_id_not_allowed');
        }

        return key;
      } catch (err) {
        this.gnLogger.error(err, 'Failed to authenticate');

        throw this.errorService
          .get('fail_to_authenticate_token');
      }
    };

    return await authenticate(params, path);
  }
}

module.exports = AuthenticateBs;
