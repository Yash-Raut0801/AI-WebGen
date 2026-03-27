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
        default: 'Main Course'
    },
    imageUrl: {
        type: String,
        default: 'no-photo.jpg'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);