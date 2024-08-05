const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: String, required: true, enum: ['Active', 'Upcoming', 'Completed'] },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
