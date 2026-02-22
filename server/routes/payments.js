const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Donation = require('../models/Donation');

// Create a Stripe Checkout Session (Embedded Mode)
router.post('/create-checkout-session', async (req, res) => {
    const { amount, userEmail } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
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
            return_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            metadata: {
                userEmail,
                amount: String(amount)
            }
        });

        res.send({ clientSecret: session.client_secret });
    } catch (err) {
        console.error('Stripe Session Error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get Session Status and Record Donation
router.get('/session-status', async (req, res) => {
    const { session_id } = req.query;

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.status === 'complete') {
            const { userEmail, amount } = session.metadata;

            // Check if donation is already recorded
            let donation = await Donation.findOne({ sessionId: session.id });

            if (!donation) {
                donation = new Donation({
                    amount: Number(amount),
                    userEmail,
                    date: new Date().toISOString().split('T')[0],
                    status: 'completed',
                    sessionId: session.id
                });
                await donation.save();
            }

            res.send({
                status: session.status,
                customer_email: session.customer_details.email,
                donation
            });
        } else {
            res.send({
                status: session.status,
                customer_email: session.customer_details?.email
            });
        }
    } catch (err) {
        console.error('Status Check Error:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
