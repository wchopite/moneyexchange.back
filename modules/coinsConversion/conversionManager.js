/**
 * Interface of the module
 */
const config = require('config');
const { convert } = require('../../utils/conversor');
const ConversionModel = require('./conversionModel');

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

  let conversion = await ConversionModel
    .findOne(query)
    .sort({ createdAt: -1})
    .limit(1);

  const operator = (conversion.base === base) ? config.get('conversor.operator') : '/';
  const roundTo = config.get('conversor.roundTo');
  const newValue = convert(value, conversion.conversionFactor)(operator, roundTo);
  return newValue;
};

module.exports = conversionManager;
