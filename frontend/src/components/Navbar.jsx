
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
  Globe,
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
    { to: '/cuisines', label: t('cuisines.nav', 'Cuisines'), icon: Globe },
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

  const mainText = 'text-[#393634] dark:text-white';

  return (
    <nav
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative z-50 w-full px-4 pt-5 sm:px-6 lg:px-10"
    >
      <div className="mx-auto max-w-[1500px]">

        {/* NAVBAR DESIGN */}
        <div className="relative rounded-[18px] border border-[#EDC7B9]/70 bg-gradient-to-r from-[#FAEEEA] via-[#FEFCF8] to-[#FBF6F2] p-2 shadow-[0_12px_35px_rgba(164,129,116,0.12)] dark:border-white/10 dark:from-[#422F28] dark:via-[#3A3733] dark:to-[#413C36]">

          <div className="flex min-h-[76px] items-center justify-between gap-3 px-2 sm:px-4">

            {/* BRAND */}
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="group flex shrink-0 items-center gap-3"
            >
              <div className="relative flex h-12 w-12 items-center justify-center rounded-[17px] bg-white text-[#A5654E] shadow-md shadow-[#EB9D81]/20 transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 dark:bg-white/10 dark:text-[#EDC7B9]">
                <Utensils size={23} strokeWidth={2.2} />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ECE0CD] text-[11px] text-[#9B8768]">
                  ♥
                </span>
              </div>

              <div>
                <h1 className={`font-serif text-[25px] font-extrabold leading-none tracking-tight ${mainText}`}>
                  Saveurs<span className="text-[#D78E73]">.</span>
                </h1>
                <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#A99A84]">
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
                        ? 'bg-[#EB9D81] text-[#5A3325] shadow-md shadow-[#EB9D81]/25'
                        : `${mainText} hover:bg-[#ECE0CD]/50 hover:text-[#9B8768]`
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
                  className="w-10 cursor-pointer rounded-full border border-transparent bg-white/70 py-3 ps-10 pe-3 text-xs text-[#393634] outline-none transition-all duration-300 placeholder:text-transparent focus:w-44 focus:cursor-text focus:border-[#EB9D81] focus:placeholder:text-gray-400 2xl:focus:w-48 dark:bg-white/10 dark:text-white"
                />
                <Search
                  size={17}
                  className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[#A5654E]"
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
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E6D6C6]/50 text-[#A18E7B] transition-all duration-300 hover:rotate-12 hover:bg-[#E6D6C6] dark:text-[#F4EAE0]"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* ACCOUNT */}
              {user ? (
                <div className="flex items-center gap-2 rounded-full border border-white/80 bg-white/70 p-1.5 ps-2 dark:border-white/10 dark:bg-white/10">
                  <Link
                    to={`/user/${user.id}`}
                    title={user.name}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ECE0CD] font-bold text-[#6A5E4C] transition-transform hover:scale-105"
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
                  className="flex shrink-0 items-center gap-2 rounded-full bg-[#EB9D81] px-4 py-3 text-xs font-extrabold text-[#5A3325] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#E58765] hover:shadow-md"
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
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#864F3B] shadow-sm transition-all hover:bg-[#EB9D81] xl:hidden dark:bg-white/10 dark:text-white"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="mt-3 overflow-hidden rounded-[18px] border border-[#EDC7B9]/70 bg-gradient-to-br from-[#FCF3F0] via-white to-[#FDF9F3] p-5 shadow-xl animate-fade-in xl:hidden dark:border-white/10 dark:from-[#422F28] dark:via-[#3A3733] dark:to-[#413C36]">

            {/* MOBILE HEADER */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9D917E]">
                  Welcome to
                </p>
                <h2 className={`mt-1 font-serif text-xl font-bold ${mainText}`}>
                  Saveurs<span className="text-[#D78E73]">.</span>
                </h2>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ECE0CD]/60 text-[#9B8768]">
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
                className="w-full rounded-2xl border border-[#EDC7B9] bg-white/80 py-3.5 ps-11 pe-4 text-sm text-[#393634] outline-none placeholder:text-gray-400 focus:border-[#D78E73] dark:bg-white/5 dark:text-white"
              />
              <Search
                size={18}
                className="absolute start-4 top-1/2 -translate-y-1/2 text-[#C8846B]"
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
                        ? 'border-[#EB9D81] bg-[#EDC7B9]/60 text-[#864F3B] dark:bg-[#EDC7B9]/15 dark:text-[#EDC7B9]'
                        : 'border-white bg-white/70 text-[#5A5653] hover:bg-[#ECE0CD]/40 dark:border-white/10 dark:bg-white/5 dark:text-white'
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

            <div className="my-5 border-t border-[#EDC7B9]/70 dark:border-white/10" />

            {/* LANGUAGE AND THEME */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="rounded-full bg-white/70 p-2 dark:bg-white/10">
                <LanguageSwitcher />
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 rounded-full bg-[#E6D6C6]/40 px-4 py-3 text-xs font-bold text-[#A18E7B] transition-all hover:bg-[#E6D6C6]/70 dark:text-[#F4EAE0]"
              >
                {isDark ? <Sun size={17} /> : <Moon size={17} />}
                {isDark
                  ? t('nav.lightMode', 'Light Mode')
                  : t('nav.darkMode', 'Dark Mode')}
              </button>
            </div>

            <div className="my-5 border-t border-[#EDC7B9]/70 dark:border-white/10" />

            {/* USER ACCOUNT */}
            {user ? (
              <div className="space-y-2">
                <Link
                  to={`/user/${user.id}`}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-2xl bg-white/70 p-3.5 text-sm font-bold text-[#5A5653] dark:bg-white/5 dark:text-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ECE0CD] text-[#6A5E4C]">
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
                  className="rounded-2xl bg-[#EDC7B9] py-3.5 text-center text-sm font-extrabold text-[#864F3B] transition-all hover:bg-[#EB9D81]"
                >
                  {t('nav.signIn', 'Sign In')}
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="rounded-2xl bg-[#ECE0CD] py-3.5 text-center text-sm font-extrabold text-[#6A5E4C] transition-all hover:bg-[#E2D3BC]"
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
