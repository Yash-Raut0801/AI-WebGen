const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['Appetizer', 'Main Course', 'Dessert', 'Drink'],
    required: true
  },
  image: {
    type: String // URL to an image
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);