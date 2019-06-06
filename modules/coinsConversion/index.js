// Dependencies
const conversionManager = require('./conversionManager');

let _logger;
let _schemaValidator;

const inputSchema = {
  convertSchema: {
    type: 'object',
    required: ['value','base', 'to'],
    properties: {
      value: { type: 'number' },
      base: { type: 'string', minLength: 2, maxLength: 4 },
      to: { type: 'string', minLength: 2, maxLength: 4 }
    }
  },
  conversionSchema: {
    type: 'object',
    required: ['conversionFactor','base', 'to'],
    properties: {
      conversionFactor: { type: 'number' },
      base: { type: 'string', minLength: 2, maxLength: 4 },
      to: { type: 'string', minLength: 2, maxLength: 4 }
    }
  }
};

const handler = {
  async convert(req, res) {
    let { base, to, value } = req.body;

    const { isValid, validator } = _schemaValidator.validate(Object.assign({},inputSchema.convertSchema), { base, to, value });
    if(!isValid) {
      _logger.info('Input data validation',{ payload: req.body, errors: validator.errors });
      res.status(400).json({message: 'You must indicate the correct data'});
      return;
    }

    const result = await conversionManager.convert({base, to, value});
    res.json({ result });
  },
  async save(req, res) {
    let { base, to, conversionFactor } = req.body;

    const { isValid, validator } = _schemaValidator.validate(Object.assign({},inputSchema.conversionSchema), {base, to, conversionFactor});
    if(!isValid) {
      _logger.info('Input data validation',{ payload: req.body, errors: validator.errors });
      res.status(400).json({message: 'You must indicate the correct data'});
      return;
    }

    let result = await conversionManager.save({base, to, conversionFactor});
    res.json(result);
  }
};

module.exports = ({app, logger, schemaValidator, checkAuth}) => {
  _logger = logger;
  _schemaValidator = schemaValidator;

  app.post(`/api/conversions`, handler.convert);
  app.put(`/api/conversions`, checkAuth, handler.save);
};
