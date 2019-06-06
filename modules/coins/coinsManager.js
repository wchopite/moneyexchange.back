/**
 * Interface of coins module
 */
const CoinModel = require('./coinModel');

let coinsManager = {};

coinsManager.list = async (params = {}) => {
  return await CoinModel.find(params).sort('name');
};

module.exports = coinsManager;
