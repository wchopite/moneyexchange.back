/**
 * Conversor util module
 */
const conversor = {}

conversor.convert = (value, factor) => {
  let newValue = 0;
  return function round(operator, roundTo) {
    newValue = eval(`${value} ${operator} ${factor}`).toFixed(roundTo);
    return Number(newValue);
  };
};

module.exports = conversor;
