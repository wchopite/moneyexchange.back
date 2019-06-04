// Dependencies
const coinsManager = require('./coinsManager');

const handler = {
  async listCoins(req, res) {
    let result = await coinsManager.list({});
    res.json(result);
  }
};

module.exports = ({app, asyncMiddleware}) => {
  app.get(`/api/coins/`, asyncMiddleware(handler.listCoins));
};
