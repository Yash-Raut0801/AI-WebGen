require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const mobileRoutes = require('./routes/mobileRoutes');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/mobiles', mobileRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));