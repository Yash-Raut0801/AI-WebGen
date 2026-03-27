const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage'], // Example categories
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/150',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);