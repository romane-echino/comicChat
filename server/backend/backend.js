const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const http = require('http');
const https = require('https');
require('dotenv').config();

const database = require('./db/database');
const auth = require('./routes/auth');

const app = express();
const port = 3030;
const httpsPort = 3031;

// SSL certificates
const privateKey = fs.readFileSync('./certificates/localhost+3-key.pem', 'utf8');
const certificate = fs.readFileSync('./certificates/localhost+3.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: ['https://192.168.1.207:3000', 'https://localhost:3000'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Initialize database
database.connect();

// Routes
app.use('/api/', auth);

// Create servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

// Start servers
httpServer.listen(port, '0.0.0.0', () => {
    console.log(`HTTP Server running on http://0.0.0.0:${port}`);
});

httpsServer.listen(httpsPort, '0.0.0.0', () => {
    console.log(`HTTPS Server running on https://0.0.0.0:${httpsPort}`);
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});


app.get('/hello', (req, res) => {    
    res.send('Hello World!');
});