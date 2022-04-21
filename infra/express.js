'use strict';

const express = require('express');
const bodyParser = require('body-parser');
// const publicRoutes = require('./routes/public');
// const privateRoutes = require('./routes/private');
// const matrixRobots = require('./routes/matrix-robots');
const glob = require('glob');
const path = require('path');

module.exports = (middlewares, container) => {
  const controllers = container.resolve('controllers');

  let app = express();

  app.disable('x-powered-by');
  app.enable('trust proxy');

  app.use(middlewares.requestId);
  app.use(middlewares.requestLogger);
  app.use(middlewares.automaticBalance);

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json({
    limit: '4MB'
  }));

  // privateRoutes(app, controllers, middlewares);

  const routes = glob.sync('infra/routes/**/*.route.js');

  routes.forEach(route => {
    const routePath = path.resolve(process.cwd(), route);
    require(routePath)(app, controllers, middlewares);
  });

  app.use(middlewares.blockExternalIps);

  // publicRoutes(app, controllers);

  // matrixRobots(app, controllers);

  app.use(middlewares.errorHandler);

  return app;
};
