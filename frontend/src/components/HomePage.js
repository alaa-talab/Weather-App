import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import UserContext from '../UserContext'; // Adjust the import path as per your project structure
import './HomePage.css'; // Ensure you have this CSS file for styling

function HomePage() {
    const context = useContext(UserContext);
    console.log(context);
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchHistory, setSearchHistory] = useState([]);
    const { userState, handleLogout } = useContext(UserContext);
    const { isAuthenticated, token } = userState;

    const fetchWeatherData = async (city) => {
        if (!isAuthenticated) {
            setError('Please log in to search for weather.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/weather/current`, {
                params: { city },
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setWeatherData(response.data);
            saveWeatherSearch(city, response.data);
        } catch (err) {
            console.error('Error fetching current weather data:', err);
            setError(err.message);
            setWeatherData(null);
        } finally {
            setIsLoading(false);
        }
    };

    const saveWeatherSearch = async (city, data) => {
        try {
            await axios.post(`http://localhost:5000/api/weather/saveWeather`, { city, data }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            await fetchSearchHistory();
        } catch (err) {
            console.error('Error saving weather search:', err);
        }
    };

    const fetchSearchHistory = useCallback(async () => {
        console.log("Token used for fetching search history:", token); // Debug token
   
        try {
            const response = await axios.get(`http://localhost:5000/api/weather/searchHistory`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSearchHistory(response.data);
            console.log("Search history received:", response.data); 
        } catch (err) {
            console.error('Error fetching search history:', err);
        }
    }, [token]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchSearchHistory();
        }
    }, [isAuthenticated, fetchSearchHistory]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (city) {
            fetchWeatherData(city);
        }
    };

    const getWeatherIcon = (weather) => {
        if (!weather || weather.length === 0) return 'wi wi-day-sunny';
    
        const condition = weather[0].main.toLowerCase();
    
        switch (condition) {
            case 'clear':
                return 'wi wi-day-sunny';
            case 'clouds':
                return 'wi wi-cloudy';
            case 'rain':
                return 'wi wi-rain';
            case 'snow':
                return 'wi wi-snow';
            case 'thunderstorm':
                return 'wi wi-thunderstorm';
            case 'drizzle':
                return 'wi wi-sprinkle';
            case 'mist':
            case 'smoke':
            case 'haze':
            case 'dust':
            case 'fog':
            case 'sand':
            case 'ash':
            case 'squall':
            case 'tornado':
                return 'wi wi-fog';
            default:
                return 'wi wi-day-sunny';
        }
    };
    
    if (!userState) {
        console.error('UserState is undefined');
        return <div>Loading...</div>; // or handle the error as appropriate
    }
    return (
        <div className="homepage-container">
            <h1>Weather Search</h1>
            {isAuthenticated && (
                <div>
                    <form onSubmit={handleSearch}>
                        <input 
                            type="text" 
                            value={city} 
                            onChange={(e) => setCity(e.target.value)} 
                            placeholder="Enter city" 
                        />
                        <button type="submit">Search</button>
                    </form>

                    {isLoading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : weatherData && (
    <div className="weather-info">
        <h2>Current Weather in {weatherData.name}</h2>
        <div className="weather-details">
            <i className={getWeatherIcon(weatherData.weather)}></i>
            <p>Temperature: {weatherData.main.temp}°C</p>
            <p>Weather: {weatherData.weather[0].main} - {weatherData.weather[0].description}</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            
            {/* Add more weather details as needed */}
        </div>
    </div>
)}

            <div className="search-history">
                <h2>Search History</h2>
                {searchHistory.map((historyItem, index) => (
                    <div key={index}>
                        <p>{historyItem.city} - {new Date(historyItem.searchDate).toLocaleDateString()}</p>
                        {/* Display other relevant weather details from historyItem.data */}
                    </div>
                ))}
            </div>
            <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
            )}
            {!isAuthenticated && <p>Please log in to use the weather search feature.</p>}
        </div>
    );
}


export default HomePage;