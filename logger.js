// Dependencies
const winston = require('winston');

const log = winston.createLogger({
  level: 'info',
  format: winston.format.colorize(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  log.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// TODO: make a better abstraction of bunyan library
const logger = {
  info(msg, error = {}) {
    log.info(msg, error);
  },
  warn(msg, error = {}) {
    log.warn(msg, error);
  },
  error(msg, error = {}) {
    log.error(msg, error);
  }
};

module.exports = logger;
