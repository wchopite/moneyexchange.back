/**
 * Interface of coins module
 */
const mongoose = require('mongoose');

// Import the model
require('./coinsModel');
const CoinsModel = mongoose.model('Coins');

let coinsManager = {};

coinsManager.list = async (params = {}) => {
  return await CoinsModel.find(params).sort('name');
};

module.exports = coinsManager;
