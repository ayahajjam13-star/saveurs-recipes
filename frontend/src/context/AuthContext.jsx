
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const API_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Safely read token from localStorage
const getSavedToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    return null;
  }
};

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getSavedToken);
  const [loading, setLoading] = useState(true);

  // Save and apply authentication token
  const saveToken = useCallback((newToken) => {
    setToken(newToken);

    if (newToken) {
      axios.defaults.headers.common['Authorization'] =
        `Bearer ${newToken}`;

      try {
        localStorage.setItem('token', newToken);
      } catch (error) {
        console.warn('Unable to save authentication token.');
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];

      try {
        localStorage.removeItem('token');
      } catch (error) {
        console.warn('Unable to remove authentication token.');
      }
    }
  }, []);

  // Restore authenticated user
  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const restoreUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        delete axios.defaults.headers.common['Authorization'];
        return;
      }

      setLoading(true);

      axios.defaults.headers.common['Authorization'] =
        `Bearer ${token}`;

      try {
        const response = await axios.get(`${API_URL}/me`, {
          signal: controller.signal,
        });

        if (active) {
          setUser(response.data);
        }
      } catch (error) {
        if (active && !axios.isCancel(error)) {
          setUser(null);
          saveToken(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    restoreUser();

    return () => {
      active = false;
      controller.abort();
    };
  }, [token, saveToken]);

  // Register
  const register = async (
    name,
    email,
    password,
    passwordConfirmation
  ) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      const data = response.data;

      setUser(data.user);

      if (data.token) {
        saveToken(data.token);
      }

      toast.success(
        data.message || `Welcome, ${data.user.name}!`
      );

      return data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Registration failed.'
      );

      throw error;
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      const data = response.data;

      setUser(data.user);
      saveToken(data.token);

      toast.success(`Welcome back, ${data.user.name}!`);

      return data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Login failed.'
      );

      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      if (token) {
        await axios.post(`${API_URL}/logout`);
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      setUser(null);
      saveToken(null);
      toast.success('Logged out successfully');
    }
  };

  // Login using an existing token
  const loginWithToken = (newToken) => {
    if (!newToken) return;

    saveToken(newToken);
  };

  // Email verification status
  const isEmailVerified = Boolean(user?.email_verified_at);

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    loginWithToken,
    isEmailVerified,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Auth Hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
