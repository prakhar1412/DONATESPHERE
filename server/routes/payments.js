const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Donation = require('../models/Donation');

// Create a Stripe Checkout Session
router.post('/create-checkout-session', async (req, res) => {
    const { amount, userEmail } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'Donation to DonateSphere',
                            description: 'Helping those in need',
                            images: ['https://donatesphere.vercel.app/favicon.jpg'],
                        },
                        unit_amount: amount * 100, // Amount in paise
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            customer_email: userEmail,
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/donate`,
            metadata: {
                userEmail,
                amount
            }
        });

        res.json({ id: session.id, url: session.url });
    } catch (err) {
        console.error('Stripe Session Error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Confirm Payment and Record Donation
router.post('/confirm', async (req, res) => {
    const { sessionId } = req.body;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const { userEmail, amount } = session.metadata;

            // Check if donation is already recorded
            const existing = await Donation.findOne({ sessionId: session.id });
            if (existing) return res.json({ message: 'Already recorded', donation: existing });

            const newDonation = new Donation({
                amount: Number(amount),
                userEmail,
                date: new Date().toISOString().split('T')[0],
                status: 'completed',
                sessionId: session.id
            });

            await newDonation.save();
            res.json({ message: 'Success', donation: newDonation });
        } else {
            res.status(400).json({ message: 'Payment not completed' });
        }
    } catch (err) {
        console.error('Confirmation Error:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
