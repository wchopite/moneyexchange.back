// Database module
const mongoose = require('mongoose');
const config = require('config');
const debug = require('debug')('app:db');

let _connection;
let dbUtilities = {
  buildConnectionString() {
    let connectionString = `mongodb+srv://${config.get('DB.user')}:${config.get('DB.password')}`;
    connectionString += `@${config.get('DB.server')}/${config.get('DB.name')}`;
    connectionString += '?retryWrites=true&w=majority';
    debug(connectionString);
    return connectionString;
  }
};

/**
 * Connect to database and return connection object
 */
module.exports = async () => {
  if (_connection) return _connection;

  try {
    // try to connect to database
    _connection = await mongoose.connect(dbUtilities.buildConnectionString(), {
      useNewUrlParser: true
    });
    return _connection;
  } catch(err) {
    debug(err);
    throw err;
  }
};
