const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// @route   POST api/reservations
// @desc    Create a new reservation
// @access  Public
router.post('/', reservationController.createReservation);

// @route   GET api/reservations
// @desc    Get all reservations (admin only)
// @access  Private (can add authentication middleware later)
router.get('/', reservationController.getReservations);

// @route   DELETE api/reservations/:id
// @desc    Delete a reservation (admin only)
// @access  Private
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;