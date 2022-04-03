'use strict';

const httpShutdown = require('http-shutdown');
const modules = require('./infra/bootstrap/modules');
const setupContainer = require('./infra/bootstrap/register');
const config = require('./infra/config/config');
const logger = modules.logger;

if (process.env.NODE_EXTRA_CA_CERTS) {
  const https = modules.https;
  const httpsAgent = new https.Agent({ ca: modules.fs.readFileSync(process.env.NODE_EXTRA_CA_CERTS) });
  https.globalAgent = httpsAgent;
}

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
      ipv4: modules.mdw.ipv4(container),
      requestId: modules.mdw.requestId(container, modules.awilix.asValue),
      authorize: modules.mdw.authorize(container),
      requestLogger: modules.mdw.requestLogger(container),
      errorHandler: modules.mdw.errorHandler,
      decryptWebhookContent: modules.mdw.decryptWebhookContent(container),
      blockExternalIps: modules.mdw.blockExternalIps(container),
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

    server.listen(appConfig.server.port || process.env.PORT);
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
