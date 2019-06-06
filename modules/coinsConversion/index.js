// Dependencies
const conversionManager = require('./conversionManager');

let _logger;

const handler = {
  async convert(req, res) {
    let payload = req.body || null;
    let { base, to, value } = payload;

    if (!payload) {
      _logger.info({caller: 'coinsConvertion.save', payload });
      res.status(400).json({message: 'You must indicate all necessary data'});
      return;
    }

    const result = await conversionManager.convert({base, to, value});
    res.json({ result });
  },
  async save(req, res) {
    let payload = req.body || null;

    if (!payload) {
      _logger.info({caller: 'coinsConvertion.save', payload });
      res.status(400).json({message: 'You must indicate all necessary data'});
      return;
    }

    let result = await conversionManager.save(payload);
    res.json(result);
  }
};

module.exports = ({app, logger}) => {
  _logger = logger;
  app.post(`/api/conversions`, handler.convert);
  app.put(`/api/conversions`, handler.save);
};
