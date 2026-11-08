
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LanguageSwitcher from './LanguageSwitcher';

import {
  Search,
  BarChart2,
  Info,
  Heart,
  CalendarDays,
  LogOut,
  Sun,
  Moon,
  UserRound,
  ChefHat,
  Menu,
  X,
  Sparkles,
  Utensils
} from 'lucide-react';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isArabic = i18n.language?.startsWith('ar');
  const isDark = theme === 'dark';

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') closeMobileMenu();
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      closeMobileMenu();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) return;

    navigate(`/search?q=${encodeURIComponent(query)}`);
    setSearchQuery('');
    closeMobileMenu();
  };

  const navLinks = [
    {
      to: '/',
      label: t('nav.home', 'Home'),
      icon: ChefHat
    },
    {
      to: '/search',
      label: t('nav.search', 'Search'),
      icon: Search
    },
    {
      to: '/stats',
      label: t('nav.stats', 'Stats'),
      icon: BarChart2
    },
    {
      to: '/about',
      label: t('nav.about', 'About'),
      icon: Info
    }
  ];

  if (user) {
    navLinks.push(
      {
        to: '/favorites',
        label: t('nav.favorites', 'Favorites'),
        icon: Heart
      },
      {
        to: '/meal-planner',
        label: t('nav.plan', 'Plan'),
        icon: CalendarDays
      }
    );
  }

  const mainText = 'text-[#51453D] dark:text-[#FAF7F0]';
  const mutedText = 'text-[#74675E] dark:text-[#C9BDB3]';

  return (
    <nav
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative z-50 w-full pt-4"
    >
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10">

        {/* MAIN NAVBAR */}
        <div
          className="
            relative flex items-center justify-between gap-4
            px-4 sm:px-6 py-3 rounded-2xl
            bg-gradient-to-r
            from-[#E88FA5]/25 via-[#FAF7F0]/45 to-[#A8B995]/30
            backdrop-blur-xl
            border border-[#E88FA5]/30
            shadow-xl shadow-[#718B68]/10
            transition-all duration-300
            dark:from-[#E88FA5]/15 dark:via-[#28221E]/65 dark:to-[#A8B995]/15
            dark:border-[#E88FA5]/20
          "
        >

          {/* LOGO */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 shrink-0 group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#E88FA5] flex items-center justify-center shadow-lg shadow-[#E88FA5]/20 group-hover:rotate-6 group-hover:scale-105 transition-all duration-300">
              <Utensils size={23} className="text-white" />
            </div>

            <div>
              <h1 className={`font-serif text-2xl font-bold ${mainText} leading-none tracking-tight`}>
                Saveurs
              </h1>

              <p className="text-[9px] text-[#B96F83] dark:text-[#E88FA5] tracking-[0.3em] uppercase mt-1.5">
                Taste the joy
              </p>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden xl:flex items-center gap-5 2xl:gap-7">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative flex items-center gap-2 py-2 text-sm font-semibold transition-colors duration-300 ${
                    active
                      ? 'text-[#C96F88] dark:text-[#E88FA5]'
                      : `${mainText} hover:text-[#C96F88] dark:hover:text-[#E88FA5]`
                  }`}
                >
                  <Icon size={16} />
                  {link.label}

                  {active && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-[#E88FA5]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="hidden xl:flex items-center gap-3">

            {/* SEARCH */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t('nav.searchPlaceholder', 'Search recipes...')}
                aria-label={t('nav.searchPlaceholder', 'Search recipes...')}
                className="
                  w-40 2xl:w-48 focus:w-56
                  transition-all duration-300
                  bg-white/35 dark:bg-black/20
                  border border-[#8F9E80]/30
                  rounded-full py-2.5 ps-10 pe-4
                  text-xs text-[#51453D] dark:text-[#FAF7F0]
                  placeholder:text-[#8B8179] dark:placeholder:text-[#B9ADA3]
                  outline-none focus:border-[#E88FA5]
                "
              />

              <Search
                size={16}
                className="absolute start-4 top-1/2 -translate-y-1/2 text-[#8B8179] dark:text-[#B9ADA3]"
              />
            </form>

            {/* LANGUAGE */}
            <LanguageSwitcher />

            {/* THEME */}
            <button
              type="button"
              onClick={toggleTheme}
              title={isDark ? 'Light mode' : 'Dark mode'}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="
                w-10 h-10 rounded-full
                bg-white/35 dark:bg-black/20
                border border-[#8F9E80]/30
                flex items-center justify-center
                text-[#51453D] dark:text-[#FAF7F0]
                hover:text-[#C96F88]
                hover:border-[#E88FA5]
                hover:bg-[#E88FA5]/15
                transition-all duration-300
              "
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* ACCOUNT */}
            {user ? (
              <div className="flex items-center gap-2 ps-3 border-s border-[#8F9E80]/30">

                <Link
                  to={`/user/${user.id}`}
                  title={user.name}
                  className="w-10 h-10 rounded-full bg-[#E88FA5] border-2 border-white/60 flex items-center justify-center text-white font-bold hover:scale-105 transition-transform"
                >
                  {user.name?.charAt(0)?.toUpperCase() || (
                    <UserRound size={18} />
                  )}
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  title={t('nav.logout', 'Logout')}
                  aria-label={t('nav.logout', 'Logout')}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#8B8179] dark:text-[#C9BDB3] hover:text-red-500 hover:bg-red-400/10 transition-all"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E88FA5] text-white text-xs font-bold hover:bg-[#D77F96] hover:shadow-lg hover:shadow-[#E88FA5]/20 transition-all duration-300"
              >
                <UserRound size={15} />
                {t('nav.signIn', 'Sign In')}
              </Link>
            )}
          </div>

          {/* MOBILE / TABLET BUTTON */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((previous) => !previous)}
            className="
              xl:hidden w-10 h-10 rounded-xl
              bg-white/35 dark:bg-black/20
              border border-[#8F9E80]/30
              text-[#51453D] dark:text-[#FAF7F0]
              flex items-center justify-center
              hover:bg-[#E88FA5] hover:text-white
              hover:border-[#E88FA5]
              transition-all duration-300
            "
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {/* MOBILE & TABLET MENU */}
        {mobileMenuOpen && (
          <div
            className="
              xl:hidden mt-3 p-5 rounded-2xl
              bg-[#FAF7F0]/95 dark:bg-[#28221E]/95
              backdrop-blur-xl
              border border-[#E88FA5]/30
              shadow-2xl shadow-[#718B68]/10
              animate-fade-in
            "
          >

            {/* MOBILE SEARCH */}
            <form onSubmit={handleSearch} className="relative mb-5">
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t('nav.searchPlaceholder', 'Search recipes...')}
                className="
                  w-full bg-white/70 dark:bg-black/20
                  border border-[#A8B995]/40
                  rounded-xl py-3 ps-10 pe-4 text-sm
                  text-[#51453D] dark:text-[#FAF7F0]
                  placeholder:text-[#8B8179] dark:placeholder:text-[#B9ADA3]
                  outline-none focus:border-[#E88FA5]
                "
              />

              <Search
                size={17}
                className="absolute start-3 top-1/2 -translate-y-1/2 text-[#8B8179] dark:text-[#B9ADA3]"
              />
            </form>

            {/* NAVIGATION LINKS */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-[#E88FA5]/20 text-[#C96F88] dark:text-[#E88FA5]'
                        : `${mainText} hover:bg-[#A8B995]/15 hover:text-[#C96F88]`
                    }`}
                  >
                    <Icon size={18} />
                    {link.label}

                    {active && (
                      <Sparkles size={15} className="ms-auto text-[#E88FA5]" />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="my-4 border-t border-[#A8B995]/30 dark:border-white/10" />

            {/* LANGUAGE */}
            <div className="flex items-center justify-between gap-3 py-2">
              <span className={`text-xs ${mutedText}`}>
                {t('nav.language', 'Language')}
              </span>

              <LanguageSwitcher />
            </div>

            {/* THEME */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`
                w-full flex items-center gap-3 px-4 py-3
                rounded-xl text-sm ${mainText}
                hover:bg-[#A8B995]/15 transition-all
              `}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}

              {isDark
                ? t('nav.lightMode', 'Light Mode')
                : t('nav.darkMode', 'Dark Mode')}
            </button>

            <div className="my-4 border-t border-[#A8B995]/30 dark:border-white/10" />

            {/* ACCOUNT */}
            {user ? (
              <>
                <Link
                  to={`/user/${user.id}`}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${mainText} hover:bg-[#A8B995]/15 transition-all`}
                >
                  <UserRound size={18} />
                  {t('nav.profile', 'My Profile')}
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-400/10 transition-all"
                >
                  <LogOut size={18} />
                  {t('nav.logout', 'Logout')}
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="py-3 rounded-xl text-center text-sm font-bold text-[#51453D] dark:text-[#FAF7F0] bg-[#A8B995]/25 hover:bg-[#A8B995]/40 transition-all"
                >
                  {t('nav.signIn', 'Sign In')}
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="py-3 rounded-xl text-center text-sm font-bold text-white bg-[#E88FA5] hover:bg-[#D77F96] transition-all"
                >
                  {t('nav.signUp', 'Sign Up')}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
