import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Updated import
import UserContext from '../UserContext';


function Login() {
    const [loginInput, setLoginInput] = useState('');
    const [password, setPassword] = useState('');
    const { handleLogin } = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Updated hook

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted"); // To check if form submission is detected
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { loginInput, password });
            console.log("Login successful", response.data); // Check response
            localStorage.setItem('token', response.data.token);
            handleLogin(response.data.token);
            navigate('/');
        } catch (error) {
            console.error("Login error", error); // Check for any errors
            if (error.response) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Error logging in');
            }
        }
    };
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    placeholder="Username or Email"
                    required
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password" 
                    required 
                />
                <button type="submit">Login</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
}


export default Login;
