// Depedendencies
const server = require('./server');
const logger = require('./logger');
const DB = require('./dbManager');

DB()
  .then(() => {
    logger.info('connected to the database');

    // start server
    server.start({logger});
  })
  .catch((error) => {
    logger.error('error mongodb conection', error);
  });

process.on('uncaughtException', error => {
  logger.error('uncaughtException', error);
  process.exit(1);
});

process.on('unhandledRejection', error => {
  logger.error('unhandledRejection', error);
  process.exit(1);
});
