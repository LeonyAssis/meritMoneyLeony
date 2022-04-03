class PierService {
  constructor(params) {
    this.rp = params.requestPromise;
    this.config = params.config;
    this.gnLogger = params.gnLogger;
  }

  async makeRequest(data, method, path, headers, qs) {
    this.gnLogger.addSensitiveData(this.config.pier.client_id);
    this.gnLogger.addSensitiveData(this.config.pier.access_token);

    const options = {
      method: method,
      uri: `${this.config.pier.domain}${path}`,
      json: true,
      headers: {
        'Content-Type': 'application/json',
        'access_token': this.config.pier.access_token,
        'client_id': this.config.pier.client_id
      },
      resolveWithFullResponse: true
    };

    if (headers) {
      Object.assign(options.headers, headers);
    }

    if (data) {
      options.body = data;
    }

    if (qs) {
      options.qs = qs;
    }

    const response = await this.rp(options);
    return response.body;
  }
}

module.exports = PierService;
