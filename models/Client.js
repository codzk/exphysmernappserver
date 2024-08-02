const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    contactNumber: { type: String, required: true },
    gp: { type: String, required: true },
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
