require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const menuRoutes = require('./routes/menuRoutes');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/menu', menuRoutes);

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));