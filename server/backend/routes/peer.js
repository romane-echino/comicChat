const express = require('express');
const router = express.Router();
const database = require('../db/database');

router.post('/register-desktop', async (req, res) => {
    console.log('Registering desktop peer');
    const { uniqueId, agent } = req.body;
    if (!uniqueId) {
        return res.status(400).json({ error: 'UID is required' });
    }

    try {
        const existingUser = await database.getInstance().get(`SELECT * FROM users WHERE unique_id = ?`, [uniqueId]);
        if (existingUser) {
            res.status(200).json({});
            console.log('Desktop peer already registered');
        }
        else{
            database.getInstance().run(`INSERT INTO users (unique_id, agent) VALUES (?, ?)`, [uniqueId, agent]);
            console.log('Desktop peer registered');
            res.status(200).json({});
        }
    } catch (error) {
        console.log('Failed to register desktop peer:', error);
        res.status(500).json({ error: 'Failed to register desktop peer' });
    }
});


router.post('/upsert-peer-id', async (req, res) => {
    console.log('Upserting peer ID');
    const { uniqueId, peerId } = req.body;
    if (!uniqueId || !peerId) {
        return res.status(400).json({ error: 'UID and peer ID are required' });
    }

    try {
        const existingUser = await database.getInstance().get(`SELECT * FROM users WHERE unique_id = ?`, [uniqueId]);
        if (existingUser) {
            database.getInstance().run(`UPDATE users SET peer_id = ? WHERE unique_id = ?`, [peerId, uniqueId]);
            console.log('Peer ID updated');
            res.status(200).json({});
        }
        else{
            console.log('User not found');
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.log('Failed to upsert peer ID:', error);
        res.status(500).json({ error: 'Failed to upsert peer ID' });
    }
});

module.exports = router;