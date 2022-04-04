'use strict';

const Ajv = require('ajv');
const awilix = require('awilix');
const bunyan = require('bunyan');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const logSerializers = require('../tools/log/serializers');
const appPackage = require('../../package.json');
const errors = require('../config/errors.json');
const permissions = require('../config/permissions/permissions');
const glob = require('glob');

const setImports = (dir, type) => {
  const relativePath = path.relative('infra/bootstrap', dir) + '/';
  const files = fs.readdirSync(dir);

  let imports = {};
  files.forEach(function (file) {
    file = file.replace('.js', '');
    let name = file.replace('.ctrl', '.controller');
    name = _.camelCase(name);
    if (type === 'function')
      imports[name] = require(relativePath + file)();
    else imports[name] = require(relativePath + file);
  });

  return imports;
};

const loadPermissions = () => {
  let _new_permissions = Object.assign({}, permissions);

  const _permissions = glob.sync('infra/config/permissions/**/*.permission.js');

  _permissions.forEach(permission => {
    const permissionPath = path.resolve(process.cwd(), permission);
    const loadedPermission = require(permissionPath);
    _.merge(_new_permissions, loadedPermission);
  });

  return _new_permissions;
};

module.exports = {
  env: process.env.NODE_ENV || 'development',
  permissions: loadPermissions(),
  Ajv: new Ajv({
    schemaId: 'auto'
  }),
  path: path,
  fs: require('fs-extra'),
  asyncQ: require('async-q'),
  util: require('util'),
  http: require('http'),
  https: require('https'),
  _: _,
  express: require('../express'),
  bunyan: bunyan,
  awilix: awilix, 
  pug: require('pug'),
  moment: require('moment'),
  exceljs: require('exceljs'),
  momentTz: require('moment-timezone'),
  immutable: require('immutable'),
  re2: require('re2'),
  crypto: require('crypto'),
  bluebird: require('bluebird'),
  uuid: require('uuid'),
  serializers: logSerializers,
  jsonWebToken: require('jsonwebtoken'),
  requestPromise: require('request-promise'),
  errors: errors,

  container: awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY
  }),

  logger: bunyan.createLogger({
    name: appPackage.name,
    serializers: logSerializers,
    version: appPackage.version
  }),

  Schema: require('../tools/validators/schema'),
  GnLogger: require('../tools/log/gn-logger'),
  sequelize: require('../db/models'),

  // Middlewares
  mdw: {
    authorize: require('../middlewares/authorize'),
    errorHandler: require('../middlewares/error'),
    requestId: require('../middlewares/request-id'),
    ipv4: require('../middlewares/ipv4'),
    requestLogger: require('../middlewares/request-logger'),
    decryptWebhookContent: require('../middlewares/decrypt-webhook-content'),
    blockExternalIps: require('../middlewares/block-external-ips'),
    webhookBodyParser: require('../middlewares/webhook-body-parser'),
  },

  // Controllers
  controllers: setImports('app/adapters/controllers/', 'function'),

  // Constants
  constants: require('../../app/constants'),
  stylesheetsExcel: require('../../app/stylesheets-excel')
};
