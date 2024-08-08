const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const auth = require('../middleware/authMiddleware');

// Create a new client
router.post('/', auth, async (req, res) => {
    const { name, dob, contactNumber, gp } = req.body;
    try {
        const newClient = new Client({ name, dob, contactNumber, gp });
        const client = await newClient.save();
        res.status(201).json(client);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all clients
router.get('/', auth, async (req, res) => {
    try {
        const clients = await Client.find();
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single client by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json(client);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a client by ID
router.put('/:id', auth, async (req, res) => {
    const { name, dob, contactNumber, gp } = req.body;
    try {
        let client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        client.name = name;
        client.dob = dob;
        client.contactNumber = contactNumber;
        client.gp = gp;
        await client.save();
        res.json(client);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a client by ID
router.delete('/:id', auth, async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        await client.remove();
        res.json({ message: 'Client removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
