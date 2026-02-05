const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Sweet', 'Savory'],
    required: true
  },
  pricePerKg: {
    type: Number,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Product', productSchema);
