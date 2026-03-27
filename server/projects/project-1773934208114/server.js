require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const menuRoutes = require('./routes/menuRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Define Routes
app.use('/api/menu', menuRoutes);
app.use('/api/reservations', reservationRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));