// Depedendencies
const DB = require('./dbManager');
const logger = require('./logger');

DB.connect()
  .then(() => {
    logger.info('connected to the database');

    // start server
    require('./server');
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
