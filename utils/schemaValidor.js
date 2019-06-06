// Dependencies
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });

const schemaValidator = {
  validate(schema, obj) {
    const validator = ajv.compile(schema);
    const isValid = validator(obj);
    return { validator, isValid };
  }
};

module.exports = schemaValidator;
