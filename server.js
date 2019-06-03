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
  require('./modules/coins')({app, logger});
  require('./modules/coinsConversion')({app, logger});

  // Start server
  app.listen(port, () => {
    logger.info(`Listening on port ${port}`);
  });
};
