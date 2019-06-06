// Dependencies
const mongoose = require('mongoose');
const { Schema } = mongoose;

const coinSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  code: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Coin', coinSchema);
