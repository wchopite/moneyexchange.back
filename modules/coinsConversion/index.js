// Dependencies
const conversionManager = require('./conversionManager');

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

    let result = await conversionManager.save(payload);
    res.json(result);
  }
};

module.exports = ({app}) => {
  app.post(`/api/convertions`, handler.converter);
  app.put(`/api/convertions`, handler.save);
};
