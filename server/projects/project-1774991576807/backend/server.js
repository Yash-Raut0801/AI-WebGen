const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Connect to SQLite database
const db = new sqlite3.Database('./backend/db/database.sql', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Middleware
app.use(cors()); // Allow cross-origin requests from frontend
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Import and use routes
const routes = require('./routes');
app.use('/api', routes);

// Simple root endpoint
app.get('/', (req, res) => {
    res.send('Echo Grooves Backend API');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Close the database connection when the server stops
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
        process.exit(0);
    });
});