const express = require('express');
const { check, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Get all appointments
router.get('/', auth, async (req, res, next) => {
    try {
        const appointments = await Appointment.find();
        res.json(appointments);
    } catch (err) {
        next(err);
    }
});

// Add a new appointment
router.post(
    '/',
    [
        auth,
        [
            check('date', 'Date is required').not().isEmpty(),
            check('time', 'Time is required').not().isEmpty(),
            check('name', 'Name is required').not().isEmpty(),
        ],
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { date, time, name, status } = req.body;

        try {
            const newAppointment = new Appointment({
                date,
                time,
                name,
                status,
            });

            const appointment = await newAppointment.save();
            res.json(appointment);
        } catch (err) {
            next(err);
        }
    }
);

// Update an appointment
router.put('/:id', auth, async (req, res, next) => {
    const { date, time, name, status } = req.body;

    const appointmentFields = { date, time, name, status };

    try {
        let appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { $set: appointmentFields },
            { new: true }
        );

        res.json(appointment);
    } catch (err) {
        next(err);
    }
});

// Delete an appointment
router.delete('/:id', auth, async (req, res, next) => {
    try {
        let appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        await Appointment.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Appointment removed' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
