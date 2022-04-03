'use strict';

const DEFAULT_ERROR_MESSAGE = 'DEFAULT MESSAGE: supplied parameters are not valid';

class ValidatorService {
  constructor(opts) {
    this.errorService = opts.errorService;
    this.schema = opts.schema;
  }

  execute(schema, data) {
    const valid = this.schema.for(schema)(data);
    if (!valid) {
      const err = this.schema.for(schema).errors;
      const info = this.getInfo(err);
      throw this.errorService
        .get('validation_error', info.message || DEFAULT_ERROR_MESSAGE, info.error);
    }
  }

  getInfo(schemaError) {
    const error = schemaError[0];

    if (!error) {
      return {};
    }

    const info = {
      error: {
        type: error.keyword,
        path: error.dataPath,
        meta: error.params
      },
      message: error.message
    };

    if (error.dataPath && error.dataPath !== '') {
      info.message = `${error.dataPath.slice(1)} ${error.message}`;
    }

    return info;

  }
}

module.exports = ValidatorService;
