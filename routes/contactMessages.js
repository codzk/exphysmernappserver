// routes/contactMessages.js
const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

// Create a new contact message
router.post('/', async (req, res) => {
    try {
        const { email, phone, message } = req.body;
        const newMessage = new ContactMessage({ email, phone, message });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error creating contact message:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all contact messages
router.get('/', async (req, res) => {
    try {
        const messages = await ContactMessage.find();
        res.json(messages);
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
