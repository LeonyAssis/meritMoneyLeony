'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const glob = require('glob');
const path = require('path');
const cors = require('cors');

module.exports = (middlewares, container) => {
  const controllers = container.resolve('controllers');

  let app = express();

  app.use(cors());

  app.disable('x-powered-by');
  app.enable('trust proxy');

  app.use(middlewares.requestId);
  app.use(middlewares.requestLogger); 

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json({
    limit: '4MB'
  }));

  const routes = glob.sync('infra/routes/**/*.route.js');

  routes.forEach(route => {
    const routePath = path.resolve(process.cwd(), route);
    require(routePath)(app, controllers, middlewares);
  });
  app.use(middlewares.errorHandler);

  return app;
};
