const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const twilio = require('twilio');
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const app = express();
const port = 3030;

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: ['http://192.168.1.234:3000', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Initialize SQLite database with file
const dbPath = path.resolve(__dirname, process.env.DB_PATH);
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
        return;
    }
    console.log('Connected to database.');
});

// Create tables if they don't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        phone_number TEXT UNIQUE,
        verification_code TEXT,
        token TEXT,
        verified BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Add error handling for database close
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});

app.get('/', (req, res) => {
    return res.send('Hello, world!');
});

app.post('/api/register', async (req, res) => {
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


app.post('/api/verify-code', async (req, res) => {
    const { phoneNumber, code } = req.body;

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
            db.run(
                'INSERT INTO users (phone_number, verification_code, token) VALUES (?, ?, ?)',
                [phoneNumber, code, token]
            );

            return res.status(200).json({ token });
        }
    }
    catch (error) {
        console.log('Failed to verify code:', error);
        res.status(500).json({ error: 'Failed to verify code' });
    }
});


app.post('/api/verify-token', (req, res) => {
    let { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.log('Failed to verify token: JWT error:', err);
            return res.status(401).json({ error: 'Invalid token' });
        }

        db.get('SELECT * FROM users WHERE phone_number = ?', [decoded.phoneNumber], (err, row) => {
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

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});