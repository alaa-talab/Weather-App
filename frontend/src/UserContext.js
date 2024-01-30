import { createContext, useState } from 'react';

const UserContext = createContext({
    userState: {
        isAuthenticated: false,
        token: null,
        // Add other user-related states as needed
    },
    handleLogin: () => {},
    handleLogout: () => {}
});

const UserProvider = ({ children }) => {
    const [userState, setUserState] = useState({
        isAuthenticated: false,
        token: null,
        // Initialize other user-related states here
    });

    const handleLogin = (token) => {
        localStorage.setItem('token', token);
        setUserState(prevState => ({ ...prevState, isAuthenticated: true, token }));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserState(prevState => ({ ...prevState, isAuthenticated: false, token: null }));
    };

    // Pass the userState, handleLogin, and handleLogout function to the context
    return (
        <UserContext.Provider value={{ userState, handleLogin, handleLogout }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserProvider };
export default UserContext;
