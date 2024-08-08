const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const auth = require('../middleware/authMiddleware');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Create a new client
router.post('/', auth, async (req, res) => {
    console.log('POST /api/clients route hit'); // Log for debugging
    try {
        const { name, dob, contactNumber, gp } = req.body;

        if (!name || !dob || !contactNumber || !gp) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newClient = new Client({ name, dob, contactNumber, gp });
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
        const { id } = req.params;

        // Validate the client ID
        if (!ObjectId.isValid(id)) {
            console.error(`Invalid client ID: ${id}`);
            return res.status(400).json({ message: 'Invalid client ID' });
        }

        // Attempt to find and delete the client
        const client = await Client.findByIdAndDelete(id);

        // If the client does not exist, return a 404 error
        if (!client) {
            console.error(`Client not found with ID: ${id}`);
            return res.status(404).json({ message: 'Client not found' });
        }

        // Successfully deleted the client
        res.json({ message: 'Client removed' });
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error deleting client:', error);

        // Return a 500 error with the error message
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
