'use strict';

const Interactor = require('../interactor.bs');

class ExtractIpv4Bs extends Interactor {
  constructor(params) {
    super();
    this.regex = params.regexService.build('\\b(?:[0-9]{1,3}[.]){3}[0-9]{1,3}\\b', 'i');
  }

  async execute(headers, fallbackIp) {
    let ip = headers['cf-connecting-ip'];

    if (ip) {
      return this._extract(ip);
    }

    ip = headers['x-forwarded-for'];

    if (ip) {
      ip = ip.split(',').pop();
      return this._extract(ip);
    }

    fallbackIp = fallbackIp || '';

    return this._extract(fallbackIp);
  }

  _extract(ip) {
    ip = ip.match(this.regex);

    if (ip) {
      return ip.slice()[0];
    }

    return null;
  }
}

module.exports = ExtractIpv4Bs;
