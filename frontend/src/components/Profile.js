import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import UserContext from '../UserContext'; // Adjust path as needed
import './Profile.css';

function Profile() {
    const [userDetails, setUserDetails] = useState({ username: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const { userState } = useContext(UserContext);
    

    // Fetch user details from backend
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = userState.token || localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}` // Use Bearer token format
                    }
                });
                setUserDetails(response.data);
            } catch (error) {
                if (error.response) {
                    setErrorMessage(error.response.data.message);
                } else {
                    setErrorMessage('Error fetching profile');
                }
            }
        };

        if (userState?.isAuthenticated) { // Use optional chaining
            fetchUserDetails();
        } else {
            setErrorMessage("User not authenticated");
        }
    }, [userState?.isAuthenticated, userState?.token]); // Use optional chaining

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = userState.token || localStorage.getItem('token');
            const response = await axios.put('http://localhost:5000/api/user/profile', {
                username: userDetails.username, // Include other fields as necessary
            }, {
                headers: {
                    'Authorization': `Bearer ${token}` // Use Bearer token format
                }
            });
            setUserDetails(response.data);
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Error updating profile');
            }
        }
    };

    if (!userState) { // Check if userState is available
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <h2>User Profile</h2>
            {errorMessage ? (
                <p>{errorMessage}</p>
            ) : (
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={userDetails.username}
                            onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })}
                        />
                    </div>
                    {/* Add other fields as needed */}
                    <button type="submit">Update Profile</button>
                </form>
            )}
        </div>
    );
}

export default Profile;
