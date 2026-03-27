const mongoose = require('mongoose');

const FilmSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  director: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    default: 'https://picsum.photos/800/600'
  },
  trailerUrl: {
    type: String,
    default: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Film', FilmSchema);