// Database module
const mongoose = require('mongoose');
const config = require('config');
const debug = require('debug')('app:db');

let dbUtilities = {
  buildConnectionString() {
    let connectionString = '';

    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'test') {
      connectionString = `mongodb://localhost/${config.get('DB.name')}`;
      debug(connectionString);
      return connectionString;
    }

    connectionString = `mongodb+srv://${config.get('DB.user')}:${config.get('DB.password')}`;
    connectionString += `@${config.get('DB.server')}/${config.get('DB.name')}`;
    connectionString += '?retryWrites=true&w=majority';
    debug(connectionString);
    return connectionString;
  }
};

const db = {
  connect() {
    return new Promise((resolve, reject) => {
      mongoose
        .connect(dbUtilities.buildConnectionString(), { useNewUrlParser: true })
        .then((res, err) => {
          if (err) return reject(err);
          resolve();
        })
    });
  },
  close() {
    return mongoose.disconnect();
  }
};

/**
 * Connect to database and return connection object
 */
module.exports = db;
