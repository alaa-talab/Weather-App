require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const weatherRoutes = require('./routes/weatherRoutes'); // Import weather routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/authRoutes');

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000' // Adjust as per your frontend's URL
}));

// Routes
app.use('/api/weather', weatherRoutes); // Use weather routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
// Fallback route for undefined paths
app.use('*', (req, res) => {
    res.status(404).send('404 Not Found');
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
