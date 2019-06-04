/**
 * Interface of the module
 */
const mongoose = require('mongoose');

// Import the model
require('./conversionModel');
const ConversionModel = mongoose.model('Coins_Conversion');

let conversionManager = {};

conversionManager.save = async (data = {}) => {
  const { base, to, conversionFactor } = data;
  const now = new Date().valueOf();

  const conversion = new ConversionModel({
    base,
    to,
    conversionFactor,
    date: now
  });

  return await conversion.save();
};

conversionManager.convert = async (params = {}) => {
  const { base, to, value } = params;
  const query = {
    $or: [
      { $and: [{base, to}]},
      { $and: [{base: to, to: base}]},
    ]
  };

  const conversion = await ConversionModel
    .find(query)
    .sort({ createdAt: -1})
    .limit(1);
  const newValue = value*conversion[0].conversionFactor;
  return newValue;
};

module.exports = conversionManager;
