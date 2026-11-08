
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {

  // Get saved theme
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('theme');

      return savedTheme === 'dark' || savedTheme === 'light'
        ? savedTheme
        : 'light';
    } catch (error) {
      return 'light';
    }
  });

  // Apply theme to HTML
  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle('dark', theme === 'dark');

    root.style.colorScheme = theme;

    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('Unable to save theme preference.');
    }
  }, [theme]);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    setTheme((previousTheme) =>
      previousTheme === 'light' ? 'dark' : 'light'
    );
  }, []);

  // Set a specific theme
  const changeTheme = useCallback((newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setTheme(newTheme);
    }
  }, []);

  const value = {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    changeTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom Hook
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return context;
}
