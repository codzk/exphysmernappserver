const express = require('express');
const { check, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new appointment
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
    async (req, res) => {
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
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// Get all appointments
router.get('/', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update an appointment
router.put('/:id', auth, async (req, res) => {
    const { date, time, name, status } = req.body;

    // Build appointment object
    const appointmentFields = {};
    if (date) appointmentFields.date = date;
    if (time) appointmentFields.time = time;
    if (name) appointmentFields.name = name;
    if (status) appointmentFields.status = status;

    try {
        let appointment = await Appointment.findById(req.params.id);

        if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });

        appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { $set: appointmentFields },
            { new: true }
        );

        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete an appointment
router.delete('/:id', auth, async (req, res) => {
    try {
        let appointment = await Appointment.findById(req.params.id);

        if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });

        await Appointment.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Appointment removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
