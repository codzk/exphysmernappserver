const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    contactNumber: { type: String, required: true },
    gp: { type: String, required: true }
});

module.exports = mongoose.model('Client', clientSchema);
