// Depedencies
const expect = require('chai').expect;
const { convert } = require('../utils/conversor');
const config = require('config');

describe('Conversor library', () => {
  let value = 100;
  let conversionFactor = 0.88;
  let operator = config.get('conversor.operator');
  let roundTo = config.get('conversor.roundTo');

  it('Apply default config conversor parameters', () => {
    const convertedValue = convert(value, conversionFactor)(operator,roundTo);
    expect(convertedValue).to.be.a('number');
    expect(convertedValue).to.equal(88.0000);
  });

  it('Round to specific number', () => {
    operator = config.get('conversor.operator');
    roundTo = 2;

    const convertedValue = convert(value, conversionFactor)(operator,roundTo);
    expect(convertedValue).to.be.a('number');
    expect(convertedValue).to.equal(88.00);
  });

  it('Apply "/" operator', () => {
    operator = '/';
    roundTo = 2;

    const convertedValue = convert(value, conversionFactor)(operator,roundTo);
    expect(convertedValue).to.be.a('number');
    expect(convertedValue).to.equal(113.64);
  });
});
