import express from 'express';

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
