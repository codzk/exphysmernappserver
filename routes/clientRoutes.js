const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Create a new client
router.post('/', async (req, res) => {
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
router.get('/', async (req, res) => {
    try {
        const clients = await Client.find();
        res.json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single client by ID
router.get('/:id', async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json(client);
    } catch (error) {
        console.error('Error fetching client:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a client by ID
router.put('/:id', async (req, res) => {
    const { name, dob, contactNumber, gp } = req.body;
    try {
        const client = await Client.findById(req.params.id);
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
        console.error('Error updating client:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a client by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid client ID' });
        }

        const client = await Client.findByIdAndDelete(id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.json({ message: 'Client removed' });
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
