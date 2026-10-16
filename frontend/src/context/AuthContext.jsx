import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      
      axios.get(`${API_URL}/me`)
        .then(res => setUser(res.data))
        .catch(() => {
          setToken(null);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        })
        .finally(() => setLoading(false));
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      setLoading(false);
    }
  }, [token]);

  const register = async (name, email, password, passwordConfirmation) => {
    const res = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
    setUser(res.data.user);
    setToken(res.data.token);
    toast.success(`Welcome, ${res.data.user.name}!`);
    return res.data;
  };

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    setUser(res.data.user);
    setToken(res.data.token);
    toast.success(`Welcome back, ${res.data.user.name}!`);
    return res.data;
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/logout`);
    } catch (err) {
      console.error(err);
    }
    setUser(null);
    setToken(null);
    toast.success('Logged out successfully');
  };
  const loginWithToken = (newToken) => {
  setToken(newToken);
  localStorage.setItem('token', newToken);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout, loginWithToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}