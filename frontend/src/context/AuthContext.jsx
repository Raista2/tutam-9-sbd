import { createContext, useState, useEffect, useContext } from 'react';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check localStorage for user data on initial load
        const storedUser = localStorage.getItem('fgoUser');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Failed to parse stored user:', error);
                localStorage.removeItem('fgoUser');
            }
        }
        setLoading(false);
    }, []);

    const updateUserData = (updatedUserData) => {
        // Update state
        setUser(updatedUserData);
        
        // Update localStorage
        localStorage.setItem('fgoUser', JSON.stringify(updatedUserData));
    };

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
            
            // Store user in localStorage for persistence
            localStorage.setItem('fgoUser', JSON.stringify(data.user));
            
            // Update state
            setUser(data.user);
            
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.message || 'Login failed. Please check your credentials.'
            };
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }
            
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.message || 'Registration failed. Please try again.'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('fgoUser');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            register,
            updateUserData,
            loading,
            isAuthenticated: !!user 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};