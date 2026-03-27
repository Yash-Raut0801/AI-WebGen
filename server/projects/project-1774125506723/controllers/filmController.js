const Film = require('../models/Film');

// @desc    Get all films
// @route   GET /api/films
// @access  Public
exports.getFilms = async (req, res) => {
  try {
    const films = await Film.find().sort({
      year: -1
    });
    res.json(films);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get single film by ID
// @route   GET /api/films/:id
// @access  Public
exports.getFilmById = async (req, res) => {
  try {
    const film = await Film.findById(req.params.id);

    if (!film) {
      return res.status(404).json({
        msg: 'Film not found'
      });
    }

    res.json(film);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'Film not found'
      });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Create a film
// @route   POST /api/films
// @access  Public
exports.createFilm = async (req, res) => {
  const {
    title,
    description,
    director,
    year,
    imageUrl,
    trailerUrl
  } = req.body;

  try {
    const newFilm = new Film({
      title,
      description,
      director,
      year,
      imageUrl,
      trailerUrl
    });

    const film = await newFilm.save();
    res.status(201).json(film);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a film
// @route   PUT /api/films/:id
// @access  Public
exports.updateFilm = async (req, res) => {
  const {
    title,
    description,
    director,
    year,
    imageUrl,
    trailerUrl
  } = req.body;

  // Build film object
  const filmFields = {};
  if (title) filmFields.title = title;
  if (description) filmFields.description = description;
  if (director) filmFields.director = director;
  if (year) filmFields.year = year;
  if (imageUrl) filmFields.imageUrl = imageUrl;
  if (trailerUrl) filmFields.trailerUrl = trailerUrl;

  try {
    let film = await Film.findById(req.params.id);

    if (!film) return res.status(404).json({
      msg: 'Film not found'
    });

    film = await Film.findByIdAndUpdate(
      req.params.id, {
        $set: filmFields
      }, {
        new: true
      }
    );

    res.json(film);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'Film not found'
      });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a film
// @route   DELETE /api/films/:id
// @access  Public
exports.deleteFilm = async (req, res) => {
  try {
    const film = await Film.findById(req.params.id);

    if (!film) return res.status(404).json({
      msg: 'Film not found'
    });

    await Film.deleteOne({
      _id: req.params.id
    }); // Use deleteOne for Mongoose v6+

    res.json({
      msg: 'Film removed'
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'Film not found'
      });
    }
    res.status(500).send('Server Error');
  }
};