'use strict';

class GnError extends Error {
  constructor(error) {
    super(error.message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.extra = error;
  }
}

class ErrorService {
  constructor(opts) {
    this.util = opts.util;
    this.errors = {};
    this.immutable = opts.immutable;
    this.logger = opts.logger;
    this.errorsArray = opts.errors;
  }

  initialize() {
    return this.errorsArray.map((e) => {
      this.errors[e.name] = this.immutable.Map({
        name: e.name,
        code: e.code,
        message: e.message
      });
    });
  }

  get(name, params, extra) {
    let error = this.errors[name];

    if (params) {
      let message = this.util.format.apply(
        this.util, [error.get('message')].concat(params)
      );

      error = error.set('message', message);
    }

    if (extra) {
      error = error.set('extra', extra);
    }

    return new GnError(error.toObject());
  }



}

module.exports = ErrorService;
