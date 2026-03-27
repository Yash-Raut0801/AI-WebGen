const express = require('express');
const router = express.Router();
const {
    getReservations,
    getReservationById,
    createReservation,
    updateReservation,
    deleteReservation
} = require('../controllers/reservationController');

// @route   GET api/reservations
// @desc    Get all reservations
// @access  Private (Admin)
router.get('/', getReservations);

// @route   GET api/reservations/:id
// @desc    Get single reservation by ID
// @access  Private (Admin)
router.get('/:id', getReservationById);

// @route   POST api/reservations
// @desc    Create a reservation
// @access  Public
router.post('/', createReservation);

// @route   PUT api/reservations/:id
// @desc    Update a reservation
// @access  Private (Admin)
router.put('/:id', updateReservation);

// @route   DELETE api/reservations/:id
// @desc    Delete a reservation
// @access  Private (Admin)
router.delete('/:id', deleteReservation);

module.exports = router;