// Dependencies
const config = require('config');
const bunyan = require('bunyan');
const log = bunyan.createLogger({ name: config.get('server.name')});

// TODO: make a better abstraction of bunyan library
const logger = {
  info(msg) {
    log.info(msg);
  },
  warn(msg) {
    log.warn(msg);
  },
  error(msg) {
    log.error(msg);
  }
};

module.exports = logger;
