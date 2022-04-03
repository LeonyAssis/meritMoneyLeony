'use strict';

const fs = require('fs');
const path = require('path');
/** @type {any} */
const Sequelize = require('sequelize');
const Relations = require('./relations');

const loadModels = (params) => {
  const databases = params.config.databases;
  let connections = {};
  let db = {
    Sequelize: Sequelize
  };

  const defaultDbAttributes = {
    logging: (query) => params.logger.trace({
      query
    }, 'Sequelize query'),
    timezone: params.config.timezone,
    define: {
      underscored: true
    },
    dialectOptions: {
      ssl: true,
      rejectUnauthorized: false
    }
  };

  Object.keys(databases)    
    .forEach((key) => {

      if (databases[key].dialect !== 'mysql' && databases[key].dialect !== 'postgres') {
        return;
      }


      databases[key] = Object.assign(databases[key], defaultDbAttributes);
      databases[key].user = databases[key].username;    
      connections[key] = new Sequelize(
        databases[key].database,
        databases[key].username,
        databases[key].password,
        databases[key]
      );

      connections[key].dialect.supports.schemas = true;

      let dbKey = key;
      if (key.endsWith('_ro')) {
        dbKey = key.replace('_ro', '');
      }

      let folderPath = `${__dirname}/models/${dbKey}`;
      let database = connections[key];
      db[key] = {};

      fs.readdirSync(folderPath)
        .forEach((file) => {
          let stats = fs.lstatSync(path.join(folderPath, file));
          if (!stats.isDirectory() && file !== '.git') {
            let model = database['import'](path.join(folderPath, file));
            db[key][model.name] = model;

            db[key][model.name].options.schema = databases[key].database;
            db[key][model.name].$schema = databases[key].database;
          }
        });

      db[key] = connections[key].models;
      db[key].sequelize = connections[key];

      connections[key]
        .authenticate()
        .catch((err) => {
          params.logger.error(err, `Unable to authenticate with "${key}" database`);
        });
    });

  new Relations(db).load();

  return db;
};

module.exports = loadModels;
