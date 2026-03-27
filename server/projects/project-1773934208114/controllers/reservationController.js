const Reservation = require('../models/Reservation');

// @route   POST api/reservations
// @desc    Create a new reservation
// @access  Public
exports.createReservation = async (req, res) => {
  const { name, email, phone, date, time, guests, specialRequests } = req.body;

  try {
    const newReservation = new Reservation({
      name,
      email,
      phone,
      date,
      time,
      guests,
      specialRequests,
    });

    const reservation = await newReservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/reservations
// @desc    Get all reservations
// @access  Private (e.g., admin only)
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ date: 1, time: 1 });
    res.json(reservations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   DELETE api/reservations/:id
// @desc    Delete a reservation
// @access  Private (e.g., admin only)
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ msg: 'Reservation not found' });
    }

    await Reservation.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Reservation removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};