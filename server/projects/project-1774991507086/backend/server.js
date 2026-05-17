const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');
const path = require('path'); // Required for path.join

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes, allowing frontend to connect
app.use(express.json()); // Parse JSON bodies of incoming requests

// Database initialization should be handled by the controller when DB is accessed.
// Ensure the db directory exists for SQLite
const dbDir = path.join(__dirname, 'db');
if (!require('fs').existsSync(dbDir)) {
    require('fs').mkdirSync(dbDir);
}

// API Routes
app.use('/api', apiRoutes);

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke on the server!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});