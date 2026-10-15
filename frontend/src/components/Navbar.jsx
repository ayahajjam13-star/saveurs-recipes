import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LanguageSwitcher from './LanguageSwitcher';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-cream/95 dark:bg-dark-card/95 backdrop-blur-sm border-b border-warm-brown/10 dark:border-dark-text/10 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-orange-accent rounded-full flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform">
              🍽️
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-warm-brown dark:text-dark-text leading-none">
                Saveurs
              </h1>
              <p className="text-xs text-warm-brown/60 dark:text-dark-text/60 tracking-widest uppercase">
                Recipes by Season
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`font-medium transition-colors ${isActive('/') ? 'text-orange-accent' : 'text-warm-brown dark:text-dark-text hover:text-orange-accent'}`}>
              {t('nav.home')}
            </Link>
            <Link to="/search" className={`font-medium transition-colors ${isActive('/search') ? 'text-orange-accent' : 'text-warm-brown dark:text-dark-text hover:text-orange-accent'}`}>
              {t('nav.search')}
            </Link>
            <Link to="/about" className={`font-medium transition-colors ${isActive('/about') ? 'text-orange-accent' : 'text-warm-brown dark:text-dark-text hover:text-orange-accent'}`}>
              {t('nav.about')}
            </Link>
            {user && (
              <Link to="/favorites" className={`font-medium transition-colors ${isActive('/favorites') ? 'text-orange-accent' : 'text-warm-brown dark:text-dark-text hover:text-orange-accent'}`}>
                ❤️ {t('nav.favorites')}
              </Link>
            )}
            
            <LanguageSwitcher />
            
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-cream dark:bg-dark-bg border border-warm-brown/10 dark:border-dark-text/10 flex items-center justify-center hover:scale-110 transition-transform"
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            
            {user ? (
              <div className="flex items-center gap-3">
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-cream dark:hover:bg-dark-bg transition-colors"
                >
                  <div className="w-8 h-8 bg-orange-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-warm-brown dark:text-dark-text">
                    {user.name}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm bg-warm-brown dark:bg-dark-bg text-cream rounded-xl hover:bg-warm-brown/90 transition-colors"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm text-warm-brown dark:text-dark-text hover:text-orange-accent transition-colors">
                  {t('nav.signIn')}
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm bg-orange-accent text-white rounded-xl hover:bg-orange-accent/90 transition-colors">
                  {t('nav.signUp')}
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-warm-brown dark:text-dark-text p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-warm-brown/10 dark:border-dark-text/10 animate-fade-in">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-warm-brown dark:text-dark-text font-medium hover:text-orange-accent">
              {t('nav.home')}
            </Link>
            <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-warm-brown dark:text-dark-text font-medium hover:text-orange-accent">
              {t('nav.search')}
            </Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-warm-brown dark:text-dark-text font-medium hover:text-orange-accent">
              {t('nav.about')}
            </Link>
            {user && (
              <Link to="/favorites" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-warm-brown dark:text-dark-text font-medium hover:text-orange-accent">
                ❤️ {t('nav.favorites')}
              </Link>
            )}
            
            <div className="py-3">
              <LanguageSwitcher />
            </div>
            
            <button onClick={toggleTheme} className="block py-3 text-warm-brown dark:text-dark-text font-medium">
              {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
            
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 text-warm-brown dark:text-dark-text font-medium hover:text-orange-accent"
                >
                  <div className="w-8 h-8 bg-orange-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span>My Profile</span>
                </Link>
                <button onClick={handleLogout} className="block py-3 text-warm-brown dark:text-dark-text font-medium hover:text-orange-accent">
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-warm-brown dark:text-dark-text font-medium hover:text-orange-accent">
                  {t('nav.signIn')}
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-orange-accent font-medium">
                  {t('nav.signUp')}
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;