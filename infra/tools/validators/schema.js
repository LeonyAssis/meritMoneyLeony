'use strict';

class Schema {
  constructor(params) {
    this.asyncQ = params.asyncQ;
    this.ajv = params.ajv;
    this.fs = params.fs;
    this.path = params.jsonSchemaPath;
    this.compiled = {};
  }

  initialize() {
    const addSchema = (file) => {
      const schema = require(`${this.path}/${file}`);
      this.ajv.addSchema(schema, file);
      return schema.id;
    };

    const compile = (schemaId) => {
      this.compiled[schemaId] = this.ajv.getSchema(schemaId);
    };

    const loadFiles = (files) => {
      const schemaIds = files.map(addSchema);
      this.asyncQ.each(schemaIds, compile);
    };

    this.fs.readdir(this.path)
      .then(loadFiles);
  }

  for(schema) {
    if (!this.compiled[schema]) {
      throw new Error('unregistered schema');
    }

    return this.compiled[schema];
  }
}

module.exports = Schema;
