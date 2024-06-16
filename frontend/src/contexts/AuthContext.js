import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        role: null
    });

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setAuth({ isAuthenticated: true, role: decodedToken.role });
            } catch (error) {
                console.error('Invalid token', error);
            }
        }
    }, []);

    const login = (token) => {
        Cookies.set('token', token);
        const decodedToken = jwtDecode(token);
        setAuth({ isAuthenticated: true, role: decodedToken.role });
    };

    const logout = () => {
        Cookies.remove('token');
        setAuth({ isAuthenticated: false, role: null });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
