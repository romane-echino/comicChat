const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor() {
        this.db = null;
    }

    connect() {
        const dbPath = path.resolve(__dirname, '../../', process.env.DB_PATH);
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err);
                return;
            }
            console.log('Connected to database.');
        });

        // Initialize schema
        this.db.serialize(() => {
            this.db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                agent TEXT,
                phone_number TEXT UNIQUE,
                verification_code TEXT,
                token TEXT UNIQUE,
                peer_id TEXT,
                unique_id TEXT UNIQUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);
        });

        // Handle cleanup
        process.on('SIGINT', () => {
            this.close();
        });
    }

    close() {
        if (this.db) {
            this.db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err);
                } else {
                    console.log('Database connection closed.');
                }
                process.exit(0);
            });
        }
    }

    getInstance() {
        return this.db;
    }
}

const database = new Database();
module.exports = database;