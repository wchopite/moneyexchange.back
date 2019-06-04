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
const asyncMiddleware = require('./middlewares/async');

const app = express();
const port = process.env.PORT || config.get('server.port');

// App middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
if (app.get('env') === 'development') {
  debug('Morgan enabled...');
  app.use(morgan('tiny'));
}

// global health check
app.get('/api', (req, res) => res.json({status: 'ok'}));

module.exports.start = ({logger}) => {
  logger.info(`${config.get('server.name')} service started`);

  // Load modules
  require('./modules/coins')({app, asyncMiddleware, logger});
  require('./modules/coinsConversion')({app, asyncMiddleware, logger});

  // TODO: add this function to a specific file (maybe a middleware)
  app.use((error, req, res, next) => {
    logger.error({ error });
    res.status(500).json({ message: 'Error', error: error.message });
  });

  // Start server
  app.listen(port, () => {
    logger.info(`Listening on port ${port}`);
  });
};
