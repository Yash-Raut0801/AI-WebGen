const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['Appetizer', 'Main Course', 'Dessert', 'Drink', 'Special'],
    default: 'Main Course'
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);