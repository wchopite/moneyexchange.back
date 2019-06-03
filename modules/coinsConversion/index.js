// Dependencies
const conversionManager = require('./conversionManager');

let _logger;

const handler = {
  async converter(req, res) {
    let payload = req.body || null;
    let { base, to, value } = payload;

    if (!payload) {
      _logger.info({caller: 'coinsConvertion.save', payload });
      res.status(400).json({message: 'You must indicate all necessary data'});
      return;
    }

    const result = await conversionManager.convert({base, to, value});
    res.json({ value: result });
  },
  async save(req, res) {
    let payload = req.body || null;

    if (!payload) {
      _logger.info({caller: 'coinsConvertion.save', payload });
      res.status(400).json({message: 'You must indicate all necessary data'});
      return;
    }

    try {
      let result = await conversionManager.save(payload);
      res.json(result);
    } catch(err) {
      _logger.error({caller: 'coinsConvertion.save', payload, err});
      res.status(500).json({message: 'Error trying to save the document'});
    }
  }
};

module.exports = ({app, logger}) => {
  _logger = logger;
  app.post(`/api/convertions`, handler.converter);
  app.put(`/api/convertions`, handler.save);
};
