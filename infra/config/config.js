'use strict';

const fs = require('fs');
const AWS = require('aws-sdk');
const ENV_DEVELOPMENT = 'development';
const env = process.env.NODE_ENV || ENV_DEVELOPMENT;
const appPackage = require('../../package.json');

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
  if (env === ENV_DEVELOPMENT) {
    return {
      [PARAMETER_CONFIG]: fs.readFileSync(`${__dirname}/config.json`),
      [PARAMETER_DATABASES]: fs.readFileSync(`${__dirname}/databases.json`),
      [PARAMETER_TIMEZONE]: 'America/Fortaleza',
     
    };
  }




  let params = {};



  return params;
};

module.exports.getConfig = async () => {
  const params = await getParameters();
  console.log(PARAMETER_CONFIG, '++++++++++++++++++++++++++++++++++');
  console.error(PARAMETER_CONFIG, '++++++++++++++++++++++++++++++++++');
  let config = JSON.parse(params[PARAMETER_CONFIG]);
  const databases = JSON.parse(params[PARAMETER_DATABASES]);
  config.timezone = 'America/Fortaleza';
  config.databases = databases;

  if (env === ENV_DEVELOPMENT && config.aws) {
    AWS.config.update(config.aws);
  }
  return config;
};

