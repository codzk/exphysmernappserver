const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

module.exports = Appointment;
