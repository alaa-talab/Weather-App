const mongoose = require('mongoose');

const weatherHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    city: String,
    data: {}, // Store the weather data object
    searchDate: { type: Date, default: Date.now }
});

const WeatherHistory = mongoose.model('WeatherHistory', weatherHistorySchema);

module.exports = WeatherHistory;
