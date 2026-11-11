
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
  ShoppingBasket,
  LogOut,
  Sun,
  Moon,
  UserRound,
  ChefHat,
  Menu,
  X,
  Sparkles,
  Utensils,
  Refrigerator,
  ArrowRight
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

  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') closeMobileMenu();
    };

    window.addEventListener('keydown', handleEscape);

    return () => window.removeEventListener('keydown', handleEscape);
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

  // NAVIGATION LINKS
  const navLinks = [
    { to: '/', label: t('nav.home', 'Home'), icon: ChefHat },
    { to: '/search', label: t('nav.search', 'Search'), icon: Search },
    { to: '/stats', label: t('nav.stats', 'Stats'), icon: BarChart2 },
    { to: '/fridge', label: t('fridge.nav', 'Fridge'), icon: Refrigerator },
    { to: '/about', label: t('nav.about', 'About'), icon: Info }
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
        label: 'Meal Planner',
        icon: CalendarDays
      },
      {
        to: '/shopping-list',
        label: 'Shopping List',
        icon: ShoppingBasket
      }
    );
  }

  const mainText = 'text-[#34313B] dark:text-white';

  return (
    <nav
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative z-50 w-full px-4 pt-5 sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-[1500px]">

        {/* NAVBAR DESIGN */}
        <div className="relative rounded-[30px] border border-[#B8E8EE]/70 bg-gradient-to-r from-[#EAF9FA] via-[#FFF7FA] to-[#F3EEFF] p-2 shadow-[0_12px_35px_rgba(115,155,165,0.12)] dark:border-white/10 dark:from-[#273B43] dark:via-[#34303D] dark:to-[#343047]">

          <div className="flex min-h-[76px] items-center justify-between gap-3 px-2 sm:px-4">

            {/* BRAND */}
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="group flex shrink-0 items-center gap-3"
            >
              <div className="relative flex h-12 w-12 items-center justify-center rounded-[17px] bg-white text-[#4C9BA7] shadow-md shadow-[#7ADDF2]/20 transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 dark:bg-white/10 dark:text-[#B8E8EE]">
                <Utensils size={23} strokeWidth={2.2} />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#F2C7DB] text-[11px] text-[#A65D80]">
                  ♥
                </span>
              </div>

              <div>
                <h1 className={`font-serif text-[25px] font-extrabold leading-none tracking-tight ${mainText}`}>
                  Saveurs<span className="text-[#70C9DA]">.</span>
                </h1>
                <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#B17C9B]">
                  Cook with love
                </p>
              </div>
            </Link>

            {/* DESKTOP NAVIGATION */}
            <div className="hidden items-center rounded-full border border-white/80 bg-white/65 p-1.5 shadow-sm backdrop-blur-md xl:flex dark:border-white/10 dark:bg-black/10">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative flex items-center gap-2 rounded-full px-3.5 py-3 text-[12px] font-bold transition-all duration-300 2xl:px-4 2xl:text-[13px] ${
                      active
                        ? 'bg-[#7ADDF2] text-[#24515B] shadow-md shadow-[#7ADDF2]/25'
                        : `${mainText} hover:bg-[#F2C7DB]/50 hover:text-[#A65D80]`
                    }`}
                  >
                    <Icon size={15} strokeWidth={2.2} />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* DESKTOP ACTIONS */}
            <div className="hidden items-center gap-2 xl:flex">

              {/* SEARCH */}
              <form onSubmit={handleSearch} className="group relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={t('nav.searchPlaceholder', 'Search recipes...')}
                  aria-label={t('nav.searchPlaceholder', 'Search recipes...')}
                  className="w-10 cursor-pointer rounded-full border border-transparent bg-white/70 py-3 ps-10 pe-3 text-xs text-[#34313B] outline-none transition-all duration-300 placeholder:text-transparent focus:w-44 focus:cursor-text focus:border-[#7ADDF2] focus:placeholder:text-gray-400 2xl:focus:w-48 dark:bg-white/10 dark:text-white"
                />
                <Search
                  size={17}
                  className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[#4C9BA7]"
                />
              </form>

              {/* LANGUAGE */}
              <div className="rounded-full bg-white/70 p-1.5 dark:bg-white/10">
                <LanguageSwitcher />
              </div>

              {/* THEME */}
              <button
                type="button"
                onClick={toggleTheme}
                title={isDark ? 'Light mode' : 'Dark mode'}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#CBB7F5]/50 text-[#8068B4] transition-all duration-300 hover:rotate-12 hover:bg-[#CBB7F5] dark:text-[#E1D5FF]"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* ACCOUNT */}
              {user ? (
                <div className="flex items-center gap-2 rounded-full border border-white/80 bg-white/70 p-1.5 ps-2 dark:border-white/10 dark:bg-white/10">
                  <Link
                    to={`/user/${user.id}`}
                    title={user.name}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F2C7DB] font-bold text-[#70465B] transition-transform hover:scale-105"
                  >
                    {user.name?.charAt(0)?.toUpperCase() || (
                      <UserRound size={17} />
                    )}
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    title={t('nav.logout', 'Logout')}
                    aria-label={t('nav.logout', 'Logout')}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                  >
                    <LogOut size={17} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex shrink-0 items-center gap-2 rounded-full bg-[#7ADDF2] px-4 py-3 text-xs font-extrabold text-[#24515B] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#62CFE8] hover:shadow-md"
                >
                  <UserRound size={15} />
                  {t('nav.signIn', 'Sign In')}
                  <ArrowRight size={13} />
                </Link>
              )}
            </div>

            {/* MOBILE BUTTON */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((previous) => !previous)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#397D88] shadow-sm transition-all hover:bg-[#7ADDF2] xl:hidden dark:bg-white/10 dark:text-white"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="mt-3 overflow-hidden rounded-[28px] border border-[#B8E8EE]/70 bg-gradient-to-br from-[#F0FAFC] via-white to-[#FFF1F7] p-5 shadow-xl animate-fade-in xl:hidden dark:border-white/10 dark:from-[#273B43] dark:via-[#34303D] dark:to-[#343047]">

            {/* MOBILE HEADER */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A47791]">
                  Welcome to
                </p>
                <h2 className={`mt-1 font-serif text-xl font-bold ${mainText}`}>
                  Saveurs<span className="text-[#70C9DA]">.</span>
                </h2>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F2C7DB]/60 text-[#A65D80]">
                <Sparkles size={20} />
              </div>
            </div>

            {/* MOBILE SEARCH */}
            <form onSubmit={handleSearch} className="relative mb-5">
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t('nav.searchPlaceholder', 'Search recipes...')}
                aria-label={t('nav.searchPlaceholder', 'Search recipes...')}
                className="w-full rounded-2xl border border-[#B8E8EE] bg-white/80 py-3.5 ps-11 pe-4 text-sm text-[#34313B] outline-none placeholder:text-gray-400 focus:border-[#70C9DA] dark:bg-white/5 dark:text-white"
              />
              <Search
                size={18}
                className="absolute start-4 top-1/2 -translate-y-1/2 text-[#69BACA]"
              />
            </form>

            {/* MOBILE LINKS */}
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.to);

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={closeMobileMenu}
                    className={`flex min-h-[62px] items-center gap-2 rounded-2xl border p-3 text-sm font-bold transition-all ${
                      active
                        ? 'border-[#7ADDF2] bg-[#B8E8EE]/60 text-[#397D88] dark:bg-[#B8E8EE]/15 dark:text-[#B8E8EE]'
                        : 'border-white bg-white/70 text-[#55505D] hover:bg-[#F2C7DB]/40 dark:border-white/10 dark:bg-white/5 dark:text-white'
                    }`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/80 dark:bg-white/10">
                      <Icon size={17} />
                    </span>
                    <span className="truncate">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="my-5 border-t border-[#B8E8EE]/70 dark:border-white/10" />

            {/* LANGUAGE AND THEME */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="rounded-full bg-white/70 p-2 dark:bg-white/10">
                <LanguageSwitcher />
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 rounded-full bg-[#CBB7F5]/40 px-4 py-3 text-xs font-bold text-[#8068B4] transition-all hover:bg-[#CBB7F5]/70 dark:text-[#E1D5FF]"
              >
                {isDark ? <Sun size={17} /> : <Moon size={17} />}
                {isDark
                  ? t('nav.lightMode', 'Light Mode')
                  : t('nav.darkMode', 'Dark Mode')}
              </button>
            </div>

            <div className="my-5 border-t border-[#B8E8EE]/70 dark:border-white/10" />

            {/* USER ACCOUNT */}
            {user ? (
              <div className="space-y-2">
                <Link
                  to={`/user/${user.id}`}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-2xl bg-white/70 p-3.5 text-sm font-bold text-[#55505D] dark:bg-white/5 dark:text-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F2C7DB] text-[#70465B]">
                    <UserRound size={18} />
                  </span>
                  {t('nav.profile', 'My Profile')}
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-2xl p-3.5 text-sm font-bold text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <LogOut size={18} />
                  {t('nav.logout', 'Logout')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="rounded-2xl bg-[#B8E8EE] py-3.5 text-center text-sm font-extrabold text-[#397D88] transition-all hover:bg-[#7ADDF2]"
                >
                  {t('nav.signIn', 'Sign In')}
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="rounded-2xl bg-[#F2C7DB] py-3.5 text-center text-sm font-extrabold text-[#70465B] transition-all hover:bg-[#EAB4CE]"
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
