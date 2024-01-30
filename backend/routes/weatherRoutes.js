const express = require('express');
const axios = require('axios');
const router = express.Router();
const WeatherHistory = require('../models/WeatherHistory');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({ message: 'City is required' });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching weather data' });
    }
});

router.get('/forecast', async (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({ message: 'City is required' });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        // Handle errors from OpenWeatherMap API
        if (error.response) {
            res.status(error.response.status).json({ message: error.response.data.message });
        } else {
            res.status(500).json({ message: 'Error fetching weather data' });
        }
    }
});

router.post('/saveWeather', authMiddleware, async (req, res) => {
    const { city, data } = req.body;
    const userId = req.user.id; // Assuming you have the user's ID available in req.user

    try {
        const newWeatherHistory = new WeatherHistory({ userId, city, data });
        await newWeatherHistory.save();
        res.status(200).send('Weather data saved');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/searchHistory', authMiddleware, async (req, res) => {
    const userId = req.user.id; 
    try {
        const history = await WeatherHistory.find({ userId }).sort({ searchDate: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/current', async (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({ message: 'City is required' });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching current weather data' });
    }
});




module.exports = router;
