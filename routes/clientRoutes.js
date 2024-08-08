const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const auth = require('../middleware/authMiddleware');

// Create a new client
router.post('/clients', async (req, res) => {
    try {
        const { name, dob, contact, gp } = req.body;

        if (!name || !dob || !contact || !gp) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newClient = new Client({ name, dob, contact, gp });
        await newClient.save();
        res.status(201).json(newClient);
    } catch (error) {
        console.error('Error creating client:', error);
        res.status(500).json({ message: 'Error creating client', error: error.message });
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
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json({ message: 'Client removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
