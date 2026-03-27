const express = require('express');
const router = express.Router();
const {
  getFilms,
  getFilmById,
  createFilm,
  updateFilm,
  deleteFilm
} = require('../controllers/filmController');

// @route   GET api/films
// @desc    Get all films
// @access  Public
router.get('/', getFilms);

// @route   GET api/films/:id
// @desc    Get single film by ID
// @access  Public
router.get('/:id', getFilmById);

// @route   POST api/films
// @desc    Create a film
// @access  Public (for simplicity, would be private in real app)
router.post('/', createFilm);

// @route   PUT api/films/:id
// @desc    Update a film
// @access  Public (for simplicity)
router.put('/:id', updateFilm);

// @route   DELETE api/films/:id
// @desc    Delete a film
// @access  Public (for simplicity)
router.delete('/:id', deleteFilm);

module.exports = router;