const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google users
    picture: { type: String },
    provider: { type: String, enum: ['google', 'email'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
