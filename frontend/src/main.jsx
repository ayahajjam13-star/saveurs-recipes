
import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './hooks/useFavorites';

import App from './App';

import './i18n';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <FavoritesProvider>

              <App />

              {/* Global Notifications */}
              <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={10}
                toastOptions={{
                  duration: 3500,

                  style: {
                    background: '#FFFEFC',
                    color: '#28221E',
                    border: '1px solid #EEE7DF',
                    borderRadius: '16px',
                    padding: '14px 18px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    boxShadow: '0 8px 30px rgba(40, 34, 30, 0.08)',
                  },

                  success: {
                    iconTheme: {
                      primary: '#718B68',
                      secondary: '#FFFFFF',
                    },
                  },

                  error: {
                    iconTheme: {
                      primary: '#D77F96',
                      secondary: '#FFFFFF',
                    },
                  },
                }}
              />

            </FavoritesProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
