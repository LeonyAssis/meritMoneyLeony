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
    crypto: asValue(dp.crypto),
    bluebird: asValue(dp.bluebird),
    asyncQ: asValue(dp.asyncQ),
    util: asValue(dp.util),
    logger: asValue(dp.logger),
    immutable: asValue(dp.immutable),
    re2: asValue(dp.re2),
    moment: asValue(dp.moment),
    momentTz: asValue(dp.momentTz),
    pug: asValue(dp.pug),
    uuid: asValue(dp.uuid),
    soap: asValue(dp.soap),
    minifyXML: asValue(dp.minifyXML),
    bwipjs: asValue(dp.bwipjs),
    exceljs: asValue(dp.exceljs),
    tempfile: asValue(dp.tempfile),
    holidays: asValue(dp.holidays),
    easter: asValue(dp.easter),
    jsonWebToken: asValue(dp.jsonWebToken),
    jsonSchemaPath: asValue(`${__dirname}/../tools/validators/schemas`),
    errors: asValue(dp.errors),
    requestPromise: asValue(dp.requestPromise),
    s3: asFunction((params) => {
      return new dp.AWS.S3(
        params.config.s3
      );
    }),
    sqs: asFunction((params) => {
      return new dp.AWS.SQS(params.config.sqs);
    }),
    gnBase: asFunction((params) => {
      return new dp.GnBase(
        params.config
      );
    }),
    _: asValue(dp._),

    gnLogger: asClass(dp.GnLogger)
      .scoped(),
    sequelize: asFunction(dp.sequelize)
      .singleton(),
    schema: asClass(dp.Schema)
      .singleton(),

    // SDK's
    authServerSdk: asFunction((params) => {
      const config = params.config.authServer;
      const credentials = config.credentials;

      return new dp.AuthServerSDK({
        client_id: credentials.client_id,
        client_secret: credentials.client_secret,
        urls: {
          production: config.url,
          lab: config.url
        }
      });
    }),

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
    }],
    ['app/adapters/services/caradhras-auth.service.js', {
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
