const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Basic Route
app.get('/', (req, res) => {
    res.send('DonateSphere API is running');
});

// Import Routes
const authRoutes = require('./routes/auth');
const donationRoutes = require('./routes/donations');

app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
