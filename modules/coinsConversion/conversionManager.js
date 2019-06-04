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
  const { value, base, to } = params;

  const conversion = await ConversionModel
    .find({ base, to })
    .sort({ createdAt: -1})
    .limit(1);
  const newValue = value*conversion[0].conversionFactor;
  return newValue;
};

module.exports = conversionManager;
