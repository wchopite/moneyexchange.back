// Dependencies
const coinsManager = require('./coinsManager');

let _logger;

const handler = {
  async listCoins(req, res, next) {
    try {
      let result = await coinsManager.list({});
      res.json(result);
    } catch(error) {
      _logger.error({caller: 'coins.list', payload: {}, error});
      next(error);
    }
  }
};

module.exports = ({app, logger}) => {
  _logger = logger;
  app.get(`/api/coins/`, handler.listCoins);
};
