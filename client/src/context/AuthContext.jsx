import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to parse user data from localStorage', e);
        localStorage.removeItem('user'); // Удалить некорректные данные
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const saveAuthData = (accessToken, user) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    setUser(user);
  };

  const register = async (email, username, password) => {
    try {
      const response = await axios.post('/api/auth/register', { email, username, password });
      const { accessToken, user } = response.data;
      saveAuthData(accessToken, user);
      return true;
    } catch (err) {
      setError(err.response.data.message);
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { accessToken, user } = response.data;
      saveAuthData(accessToken, user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post('/api/auth/refresh-token');
      const { accessToken } = response.data;
      const user = JSON.parse(localStorage.getItem('user'));
      saveAuthData(accessToken, user);
    } catch (err) {
      console.error('Failed to refresh token:', err);
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
