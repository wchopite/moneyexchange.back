// Dependencies
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('./userModel');
const config = require('config');

let _logger;

const handler = {
  async signup(req, res) {
    const { email, password } = req.body;

    try {
      const exists = await UserModel.findOne({email});

      if (exists) {
        res.status(409).json({ message: 'the indicated mail exists' });
        return;
      }

      const user = new UserModel({
        _id: mongoose.Types.ObjectId(),
        email,
        password: await bcrypt.hash(password, 10)
      });

      try {
        await user.save();
        res.status(201).json({message: 'Created successfully'});
      } catch(error) {
        _logger.info(error.message, { payload: req.body, errors: error });
        throw(error);
      }
    } catch(error) {
      _logger.info(error.message, { payload: req.body, errors: error });
      res.status(500).json({ message: error.message });
    }
  },
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = (email) ? await UserModel.findOne({ email }) : null;
      const validPassword = (user && password) ? await bcrypt.compare(password, user.password) : false;

      if(!user || !validPassword) {
        res.status(401).json({ message: 'Auth Failed'});
        return;
      }

      const token = jwt.sign(
        { email, userId: user._id },
        config.get('JWT.private_key'),
        { expiresIn: config.get('JWT.expirationTime') }
      );
      res.json({ message: 'Auth successful', token });
    } catch(error) {
      _logger.info(error.message, { payload: req.body, errors: error });
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = ({app, logger}) => {
  _logger = logger;

  app.post(`/api/users/signup`, handler.signup);
  app.post(`/api/users/login`, handler.login);
};
