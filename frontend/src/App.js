import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserContext from './UserContext'; // Adjust the path as per your project structure
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import './App.css';

function App() {
    const [userState, setUserState] = useState({
        isAuthenticated: false,
        token: null,
        // Add other user-related states if necessary
    });

    // Check for user authentication status (token) on app load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUserState(prevState => ({ ...prevState, isAuthenticated: true, token }));
        }
    }, []);

    const handleLogin = (token) => {
        localStorage.setItem('token', token);
        setUserState({ ...userState, isAuthenticated: true, token });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserState({ ...userState, isAuthenticated: false, token: null });
    };

    return (
        <UserContext.Provider value={{ userState, handleLogin, handleLogout }}>

            <Router>
                <div className="App">
                    <nav>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            {!userState.isAuthenticated && (
                                <>
                                    <li><Link to="/login">Login</Link></li>
                                    <li><Link to="/register">Register</Link></li>
                                </>
                            )}
                            {userState.isAuthenticated && (
                                <li><Link to="/profile">Profile</Link></li>
                            )}
                        </ul>
                    </nav>
                    <Routes>
                        <Route path="/" element={userState.isAuthenticated ? <HomePage /> : <Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={userState.isAuthenticated ? <Profile /> : <Login />} />
                    </Routes>
                </div>
            </Router>
        </UserContext.Provider>
    );
}

export default App;
