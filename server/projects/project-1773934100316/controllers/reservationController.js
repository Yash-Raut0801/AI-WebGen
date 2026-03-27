const Reservation = require('../models/Reservation');

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private (Admin)
exports.getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({
            date: 1,
            time: 1
        });
        res.json(reservations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get single reservation by ID
// @route   GET /api/reservations/:id
// @access  Private (Admin)
exports.getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({
                msg: 'Reservation not found'
            });
        }
        res.json(reservation);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                msg: 'Reservation not found'
            });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Create a reservation
// @route   POST /api/reservations
// @access  Public
exports.createReservation = async (req, res) => {
    const {
        name,
        email,
        phone,
        date,
        time,
        guests,
        notes
    } = req.body;

    try {
        const newReservation = new Reservation({
            name,
            email,
            phone,
            date,
            time,
            guests,
            notes
        });

        const reservation = await newReservation.save();
        res.status(201).json(reservation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update a reservation
// @route   PUT /api/reservations/:id
// @access  Private (Admin)
exports.updateReservation = async (req, res) => {
    const {
        name,
        email,
        phone,
        date,
        time,
        guests,
        notes,
        status
    } = req.body;

    const reservationFields = {};
    if (name) reservationFields.name = name;
    if (email) reservationFields.email = email;
    if (phone) reservationFields.phone = phone;
    if (date) reservationFields.date = date;
    if (time) reservationFields.time = time;
    if (guests) reservationFields.guests = guests;
    if (notes) reservationFields.notes = notes;
    if (status) reservationFields.status = status;

    try {
        let reservation = await Reservation.findById(req.params.id);

        if (!reservation) return res.status(404).json({
            msg: 'Reservation not found'
        });

        reservation = await Reservation.findByIdAndUpdate(
            req.params.id, {
                $set: reservationFields
            }, {
                new: true
            }
        );

        res.json(reservation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a reservation
// @route   DELETE /api/reservations/:id
// @access  Private (Admin)
exports.deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                msg: 'Reservation not found'
            });
        }

        await Reservation.deleteOne({
            _id: req.params.id
        });

        res.json({
            msg: 'Reservation removed'
        });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                msg: 'Reservation not found'
            });
        }
        res.status(500).send('Server Error');
    }
};