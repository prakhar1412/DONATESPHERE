const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');

// Get all donations for a user
router.get('/:email', async (req, res) => {
    try {
        const donations = await Donation.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
        res.json(donations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a donation
router.post('/', async (req, res) => {
    const { amount, userEmail, date } = req.body;
    try {
        const newDonation = new Donation({ amount, userEmail, date });
        await newDonation.save();
        res.status(201).json(newDonation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
