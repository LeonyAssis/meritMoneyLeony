'use strict';

const fs = require('fs');
const ENV_DEVELOPMENT = 'development';
const env = process.env.NODE_ENV || ENV_DEVELOPMENT;

if (env === ENV_DEVELOPMENT) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const buildParamName = (param) => {
  return `${param}`;
};

const PARAMETER_CONFIG = buildParamName('/config');
const PARAMETER_DATABASES = buildParamName('/databases');
const PARAMETER_TIMEZONE = `/${env}/common/timezone`;
const getParameters = async () => {

  return {
    [PARAMETER_CONFIG]: fs.readFileSync(`${__dirname}/config.json`),
    [PARAMETER_DATABASES]: fs.readFileSync(`${__dirname}/databases.json`),
    [PARAMETER_TIMEZONE]: 'America/Fortaleza',

  };

  let params = {};
  return params;
};

module.exports.getConfig = async () => {
  const params = await getParameters();

  let config = JSON.parse(params[PARAMETER_CONFIG]);
  const databases = JSON.parse(params[PARAMETER_DATABASES]);
  config.timezone = 'America/Fortaleza';
  config.databases = databases;

  return config;
};

