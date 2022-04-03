'use strict';

class SensitiveDataStream {
  constructor() {
    this.sensitiveDataArr = [];
  }

  addSensitiveData(data) {
    if (data) {
      this.sensitiveDataArr.push(data);
    }
  }

  write(data) {
    this.sensitiveDataArr.forEach((sensitiveData) => {
      let mask = '*'.repeat(sensitiveData.length);
      data = data.split(sensitiveData).join(mask);
    });
    process.stdout.write(data);
  }
}

class GnLogger {
  constructor(opts) {
    this.logger = opts.logger.child({
      uuid: opts.requestId
    });
    this.sensitiveDataStream = new SensitiveDataStream();

    this.logger.streams = [];
    this.logger.addStream({
      stream: this.sensitiveDataStream,
      level: opts.config.logLevel
    });
  }

  trace(...args) {
    this.logger.trace(...args);
  }

  debug(...args) {
    this.logger.debug(...args);
  }

  info(...args) {
    this.logger.info(...args);
  }

  warn(...args) {
    this.logger.warn(...args);
  }

  error(...args) {
    this.logger.error(...args);
  }

  addSensitiveData(data) {
    this.sensitiveDataStream.addSensitiveData(data);
  }

  addContext(dataObj) {
    this.logger = this.logger.child(dataObj);
  }
}

module.exports = GnLogger;
