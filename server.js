/*
 * MoneyExchange Server
 *
 * Application server setup and initialization
 */
const config = require('config');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const debug = require('debug')('app:startup');
const logger = require('./logger');
const schemaValidator = require('./utils/schemaValidor');
const checkAuth = require('./middlewares/check-auth');
require('express-async-errors');

const app = express();
const port = process.env.PORT || config.get('server.port');

// App middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
if (app.get('env') === 'development') {
  debug('Morgan enabled...');
  app.use(morgan('combined'));
}
/**
 * Allow Origin
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    res.status(200).json({});
    return;
  }
  next();
});

// global health check
app.get('/api', (req, res) => res.json({status: 'ok'}));

// Load modules
require('./modules/coins')({app, logger, schemaValidator});
require('./modules/coinsConversion')({app, logger, schemaValidator, checkAuth});
require('./modules/users')({app, logger, schemaValidator});

// TODO: add this function to a specific file (maybe a middleware)
app.use((error, req, res, next) => {
  logger.error(error.message, error);
  res.status(500).json({ message: 'Error', error: error.message });
});

// Start server
const server = app.listen(port, () => {
  logger.info(`${config.get('server.name')} service started`);
  logger.info(`Listening on port ${port}`);
});

module.exports = server;
