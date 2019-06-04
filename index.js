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
    console.log(error);
    logger.error({message: 'error mongodb conection', error});
  });
