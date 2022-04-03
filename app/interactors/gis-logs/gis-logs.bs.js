'use strict';
var pkg = require('../../../package.json');
class GisLogsBs {
  constructor(params) {
    this.authServerSdk = params.authServerSdk;
    this.errorService = params.errorService;
    this.gnLogger = params.gnLogger;
    this.permissions = params.permissions;
    this.gisLogsRepository = params.gisLogsRepository;
  }

  async saveLog(req) {
    let request = {
      params: req.params,
      query: req.query,
      body: req.body
    };

    let body = {
      req: request,
      method: req.method,
      app_id: req.key ? req.key.organization_id : null,
      route: req.route.path,
      version: pkg.version
    };

    const gis_log = await this.gisLogsRepository
      .create(body);

    req.gis_log_id = gis_log.id;
  }
}

module.exports = GisLogsBs;
