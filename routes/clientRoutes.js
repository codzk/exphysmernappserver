const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const Client = require('../models/Client');

const router = express.Router();

// Create a client
router.post(
    '/',
    [
        auth,
        [
            check('name', 'Name is required').not().isEmpty(),
            check('dob', 'Date of Birth is required').not().isEmpty(),
            check('contactNumber', 'Contact Number is required').not().isEmpty(),
            check('gp', 'GP is required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, dob, contactNumber, gp } = req.body;

        try {
            const newClient = new Client({
                name,
                dob,
                contactNumber,
                gp,
            });

            const client = await newClient.save();
            res.json(client);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// Get all clients
router.get('/', auth, async (req, res) => {
    try {
        const clients = await Client.find().sort({ name: 1 });
        res.json(clients);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update a client
router.put('/:id', auth, async (req, res) => {
    const { name, dob, contactNumber, gp } = req.body;

    const clientFields = {};
    if (name) clientFields.name = name;
    if (dob) clientFields.dob = dob;
    if (contactNumber) clientFields.contactNumber = contactNumber;
    if (gp) clientFields.gp = gp;

    try {
        let client = await Client.findById(req.params.id);

        if (!client) return res.status(404).json({ msg: 'Client not found' });

        client = await Client.findByIdAndUpdate(
            req.params.id,
            { $set: clientFields },
            { new: true }
        );

        res.json(client);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete a client
router.delete('/:id', auth, async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);

        if (!client) return res.status(404).json({ msg: 'Client not found' });

        await Client.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Client removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
