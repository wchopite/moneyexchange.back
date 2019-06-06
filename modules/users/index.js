// Dependencies
const userManager = require('./userManager');

let _logger;

const handler = {
  async signup(req, res) {
    const { email, password } = req.body;

    try {
      const { status, message } = await userManager.signUp({ email, password });
      res.status(status).json({message});
    } catch(error) {
      _logger.info(error.message, { payload: req.body, errors: error });
      res.status(500).json({ message: error.message });
    }
  },
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const { status, token, message } = await userManager.login({ email, password });
      res.status(status).json({ message, token });
    } catch(error) {
      _logger.info(error.message, { payload: req.body, errors: error });
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = ({app, logger}) => {
  _logger = logger;

  app.post(`/api/signup`, handler.signup);
  app.post(`/api/login`, handler.login);
};
