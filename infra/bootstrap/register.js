'use strict';

const dp = require('./modules');
const _ = require('lodash');

module.exports = (config) => {
  const container = dp.container;
  const asValue = dp.awilix.asValue;
  const asClass = dp.awilix.asClass;
  const asFunction = dp.awilix.asFunction;

  container.register({
    env: asValue(dp.env),
    config: asValue(config),
    ajv: asValue(dp.Ajv),
    permissions: asValue(dp.permissions),
    path: asValue(dp.path),
    fs: asValue(dp.fs),    
    bcrypt: asValue(dp.bcrypt),  
    asyncQ: asValue(dp.asyncQ),
    util: asValue(dp.util),
    logger: asValue(dp.logger),
    immutable: asValue(dp.immutable),
    re2: asValue(dp.re2),   
    moment: asValue(dp.moment),
    momentTz: asValue(dp.momentTz),
    pug: asValue(dp.pug),
    uuid: asValue(dp.uuid),    
    jwt: asValue(dp.jwt),
    jsonSchemaPath: asValue(`${__dirname}/../tools/validators/schemas`),
    errors: asValue(dp.errors),
    requestPromise: asValue(dp.requestPromise),   
    _: asValue(dp._),
    gnLogger: asClass(dp.GnLogger)
      .scoped(),
    sequelize: asFunction(dp.sequelize)
      .singleton(),
    schema: asClass(dp.Schema)
      .singleton(),

    // Controllers
    controllers: asValue(dp.controllers),

    // Constants
    constants: asValue(dp.constants),
    stylesheetsExcel: asValue(dp.stylesheetsExcel)
  });

  container.loadModules([
    'app/interactors/**/*.js',
    'app/services/**/*.js',
    'app/adapters/services/**/*.js',
    ['app/adapters/services/error.service.js', {
      lifetime: dp.awilix.Lifetime.SINGLETON
    }]   
  ], {
    formatName: (name) => {
      name = name.replace('.ctrl', '.controller');
      name = name.replace('.rep', '.repository');
      name = _.camelCase(name);
      return name;
    },
    resolverOptions: {
      register: dp.awilix.asClass
    }
  });

};
