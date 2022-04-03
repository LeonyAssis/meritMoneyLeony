module.exports = {
  err: (err) => {
    if (!err) {
      return null;
    }

    let logErr = {
      message: `${err.message}`,
      stack: `${err.stack}`
    };

    if (err.extra) {
      logErr.extra = JSON.stringify(err.extra);
    }

    return logErr;
  },

  req: (req) => {
    if (!req) {
      return null;
    }

    return {
      method: `${req.method}`,
      path: `${req.path}`,
      agent: `${req.headers['user-agent']}`,
      ip: `${req.ipv4}`
    };
  },

  res: (res) => {
    if (!res) {
      return null;
    }

    return {
      status: +res.statusCode,
      time: Date.now() - res.reqStartedAt
    };
  },

  account: (account) => {
    return +account;
  },

  npm: (npm) => {
    if (!npm) {
      return null;
    }

    return {
      vulnerabilities: {
        total: +npm.vulnerabilities.total,
        info: +npm.vulnerabilities.info,
        low: +npm.vulnerabilities.low,
        moderate: +npm.vulnerabilities.moderate,
        high: +npm.vulnerabilities.high,
        critical: +npm.vulnerabilities.critical,
      }
    };
  },

  card: (card) => {
    if (!card) {
      return null;
    }

    return {
      token: `${card.token}`,
      acquirerToken: `${card.acquirerToken}`
    };
  },

  service: (service) => {
    if (!service) {
      return null;
    }

    let serviceLog = {
      url: `${service.url}`,
    };

    if (service.request) {
      serviceLog.request = {
        body: `${service.request.body}`
      };
    }

    if (service.response) {
      serviceLog.response = {
        status: +service.response.status || 0,
        body: `${service.response.body}`
      };
    }

    return serviceLog;
  },
};
