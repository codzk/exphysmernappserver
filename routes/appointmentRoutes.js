const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const auth = require('../middleware/authMiddleware');

// Create an appointment
router.post('/', auth, async (req, res) => {
    const { date, time, name, status } = req.body;
    try {
        const appointment = new Appointment({
            date,
            time,
            name,
            status
        });
        await appointment.save();
        res.status(201).json(appointment);
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all appointments
router.get('/', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single appointment by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json(appointment);
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update an appointment by ID
router.put('/:id', auth, async (req, res) => {
    const { date, time, name, status } = req.body;
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { date, time, name, status },
            { new: true, runValidators: true }
        );
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json(appointment);
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete an appointment by ID
router.delete('/:id', auth, async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json({ message: 'Appointment deleted' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
