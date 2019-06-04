/**
 * Interface of the module
 */
const mongoose = require('mongoose');

// Import the model
require('./coinsModel');
const CoinsModel = mongoose.model('Coins');

let coinsManager = {};

coinsManager.list = async (params = {}) => {
  try {
    return await CoinsModel.findsdd(params);
  } catch(err) {
    throw err;
  }
};

module.exports = coinsManager;
