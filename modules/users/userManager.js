/**
 * Interface of the module
 */
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('./userModel');

let userManager = {};

userManager.signUp = async (params = {}) => {
  const { email, password } = params;

  try {
    const exists = await UserModel.findOne({email});

    if (exists) {
      return { status: 409, message: 'the indicated mail exists' };
    }

    const user = new UserModel({
      email,
      password: await bcrypt.hash(password, 10)
    });

    try {
      await user.save();
      return {status: 200, message: 'Created successfully'};
    } catch(error) {
      throw(error);
    }
  } catch(error) {
    throw error;
  }
};

userManager.login = async (params = {}) => {
  const { email, password } = params;

  try {
    const user = (email) ? await UserModel.findOne({ email }) : null;
    const validPassword = (user && password) ? await bcrypt.compare(password, user.password) : false;

    if(!user || !validPassword) {
      return {status: 401, message: 'Auth Failed'};
    }

    const token = jwt.sign(
      { email, userId: user._id },
      config.get('JWT.private_key'),
      { expiresIn: config.get('JWT.expirationTime') }
    );
    return {status: 200, message: 'Auth successful', token};
  } catch(error) {
    throw error;
  }
};

module.exports = userManager;
