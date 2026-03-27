require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const filmRoutes = require('./routes/filmRoutes');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// Define Routes
app.use('/api/films', filmRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));