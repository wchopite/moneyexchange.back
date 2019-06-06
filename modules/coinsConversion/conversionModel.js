// Dependencies
const mongoose = require('mongoose');
const { Schema } = mongoose;

const conversionSchema = new Schema({
  base: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: false
  },
  conversionFactor: {
    type: Number,
    required: true
  },
  date: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CoinsConversion', conversionSchema);
