const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const jwt = require('jsonwebtoken');
const database = require('../db/database');


router.post('/register', async (req, res) => {
    console.log('Registering phone number');
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    try {
        let verifiation = await twilioClient.verify.v2
            .services(process.env.TWILIO_VERIFY_SERVICE_SID)
            .verifications
            .create({ to: phoneNumber, channel: 'sms' });

        if (verifiation.status === 'pending') {
            res.status(200).json({});
        }
        else {
            res.status(500).json({ error: 'Failed to register' });
        }
    } catch (error) {
        console.log('Failed to generate token:', error);
        res.status(500).json({ error: 'Failed to generate token' });
    }
});


router.post('/verify-code', async (req, res) => {
    console.log('Verifying phone code');
    const { phoneNumber, code, uniqueId, agent } = req.body;

    if (!/^\d{6}$/.test(code)) {
        return res.status(400).json({ error: 'Invalid verification code format' });
    }

    if (!/^\+\d{1,50}$/.test(phoneNumber)) {
        return res.status(400).json({ error: 'Invalid phone number format' });
    }

    const verificationCheck = await twilioClient.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks.create({
            code: code,
            to: phoneNumber,
        });


    try {
        if (verificationCheck.status !== 'approved') {
            return res.status(400).json({ error: 'Invalid verification code' });
        }
        else {
            const token = jwt.sign({ phoneNumber }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            database.getInstance().run(
                'INSERT INTO users (phone_number, verification_code, token, unique_id, agent) VALUES (?, ?, ?, ?, ?)',
                [phoneNumber, code, token, uniqueId, agent]
            );

            return res.status(200).json({ token });
        }
    }
    catch (error) {
        console.log('Failed to verify code:', error);
        res.status(500).json({ error: 'Failed to verify code' });
    }
});


router.post('/verify-token', (req, res) => {
    console.log('Verifying token');
    let { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.log('Failed to verify token: JWT error:', err);
            return res.status(401).json({ error: 'Invalid token' });
        }

        database.getInstance().get('SELECT * FROM users WHERE phone_number = ?', [decoded.phoneNumber], (err, row) => {
            if (err) {
                console.log('Failed to verify token:', err);
                return res.status(500).json({ error: 'Failed to verify token' });
            }

            if (!row) {
                console.log('Failed to verify token: User not found');
                return res.status(401).json({ error: 'Invalid token' });
            }

            res.status(200).json({});
        });
    });
});

router.get('/health', (req, res) => {
    console.log('Health check');
    res.status(200).json({ status: 'ok' });
});


module.exports = router;