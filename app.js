'use strict';

if (!process.env.NODE_ENV)
  require('dotenv').config();

const httpShutdown = require('http-shutdown');
const modules = require('./infra/bootstrap/modules');
const setupContainer = require('./infra/bootstrap/register');
const config = require('./infra/config/config');
const logger = modules.logger;


async function shutdown(server, sequelize) {
  server.shutdown(async (err) => {
    try {
      await Promise.all(
        Object
          .keys(sequelize)
          .map(async (key) => {
            if (sequelize[key].sequelize && sequelize[key].sequelize.close) {
              await sequelize[key].sequelize.close();
            }
          })
      );
    } catch (e) {
      err = e;
    }

    if (err) {
      logger.error({ err }, 'Shutdown error');
      process.exit(1);
    } else {
      logger.info('Shutting down');
      process.exit(0);
    }
  });
}

async function init() {
  try {
    const appConfig = await config.getConfig();

    setupContainer(appConfig);

    const container = modules.container;

    const middlewares = {     
      requestId: modules.mdw.requestId(container, modules.awilix.asValue),
      authorize: modules.mdw.authorize(container),      
      requestLogger: modules.mdw.requestLogger(container),
      automaticBalance: modules.mdw.automaticBalance(container),
      errorHandler: modules.mdw.errorHandler,
      decryptWebhookContent: modules.mdw.decryptWebhookContent(container),     
      webhookBodyParser: modules.mdw.webhookBodyParser(container),
    };

    container.resolve('schema')
      .initialize();
    container.resolve('errorService')
      .initialize();

    const app = modules.express(middlewares, container);

    const sequelize = container.resolve('sequelize');

    let http = modules.http;
    let server = http.createServer(app);

    server = httpShutdown(server);

    server.listen(process.env.PORT || appConfig.server.port);
    server.timeout = 120000;

    process.on('SIGINT', () => shutdown(server, sequelize));
    process.on('SIGTERM', () => shutdown(server, sequelize));
    logger.info('Bootstrapped');
  } catch (err) {
    logger.fatal({ err }, 'Bootstrap error');
    process.exit(1);
  }
}

init();
