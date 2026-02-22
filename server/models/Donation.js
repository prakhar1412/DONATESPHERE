const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    userEmail: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, default: 'completed' },
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
