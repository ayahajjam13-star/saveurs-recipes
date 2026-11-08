import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Search, BarChart2, Info, Heart, Calendar, LogOut, Sun, Moon, User, ChefHat } from 'lucide-react';

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
    <nav className="absolute top-0 left-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent transition-all pt-4 pb-8">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <ChefHat size={32} className="text-orange-accent group-hover:scale-110 transition-transform" />
            <div>
              <h1 className="font-serif text-2xl font-bold text-white leading-none">
                Saveurs
              </h1>
              <p className="text-[10px] text-white/70 tracking-widest uppercase mt-1">
                Recipes
              </p>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-orange-accent border-b-2 border-orange-accent pb-1' : 'text-white/90 hover:text-white'}`}>Home</Link>
            
            <Link to="/search" className={`text-sm font-medium transition-colors flex items-center gap-1 ${isActive('/search') ? 'text-orange-accent border-b-2 border-orange-accent pb-1' : 'text-white/90 hover:text-white'}`}>
              <Search size={16} /> Search
            </Link>
            
            <Link to="/stats" className={`text-sm font-medium transition-colors flex items-center gap-1 ${isActive('/stats') ? 'text-orange-accent border-b-2 border-orange-accent pb-1' : 'text-white/90 hover:text-white'}`}>
              <BarChart2 size={16} /> Stats
            </Link>
            
            <Link to="/about" className={`text-sm font-medium transition-colors flex items-center gap-1 ${isActive('/about') ? 'text-orange-accent border-b-2 border-orange-accent pb-1' : 'text-white/90 hover:text-white'}`}>
              <Info size={16} /> About
            </Link>
            
            {user && (
              <>
                <Link to="/favorites" className={`text-sm font-medium transition-colors flex items-center gap-1 ${isActive('/favorites') ? 'text-orange-accent border-b-2 border-orange-accent pb-1' : 'text-white/90 hover:text-white'}`}>
                  <Heart size={16} /> Favorites
                </Link>
                <Link to="/meal-planner" className={`text-sm font-medium transition-colors flex items-center gap-1 ${isActive('/meal-planner') ? 'text-orange-accent border-b-2 border-orange-accent pb-1' : 'text-white/90 hover:text-white'}`}>
                  <Calendar size={16} /> Plan
                </Link>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-5">
            
            {/* Search Bar */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search recipes..." 
                className="bg-[#2C1E16]/50 backdrop-blur-md border border-white/10 text-white rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-orange-accent placeholder:text-white/50 w-56 transition-all focus:w-72"
              />
              <Search size={16} className="absolute left-3 top-3 text-white/50" />
            </div>

            <LanguageSwitcher />
            
            <button onClick={toggleTheme} className="text-white/80 hover:text-white transition-colors">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to={`/user/${user.id}`} className="w-10 h-10 bg-orange-accent rounded-full flex items-center justify-center text-white font-bold border border-white/20 hover:scale-105 transition-all">
                  {user.name?.charAt(0).toUpperCase()}
                </Link>
                <button onClick={handleLogout} className="text-white/60 hover:text-red-400 transition-colors" title="Logout">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all">
                <User size={20} />
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 bg-black/90 backdrop-blur-md">
            <Link to="/" className="block py-2 text-sm font-medium text-white">Home</Link>
            <Link to="/search" className="flex items-center gap-2 py-2 text-sm font-medium text-white"><Search size={16}/> Search</Link>
            <Link to="/stats" className="flex items-center gap-2 py-2 text-sm font-medium text-white"><BarChart2 size={16}/> Stats</Link>
            <Link to="/about" className="flex items-center gap-2 py-2 text-sm font-medium text-white"><Info size={16}/> About</Link>
            {user && (
              <>
                <Link to="/favorites" className="flex items-center gap-2 py-2 text-sm font-medium text-white"><Heart size={16}/> Favorites</Link>
                <Link to="/meal-planner" className="flex items-center gap-2 py-2 text-sm font-medium text-white"><Calendar size={16}/> Plan</Link>
              </>
            )}
            <div className="py-2"><LanguageSwitcher /></div>
            <button onClick={toggleTheme} className="flex items-center gap-2 py-2 text-sm font-medium text-white">{theme === 'light' ? <><Moon size={16}/> Dark Mode</> : <><Sun size={16}/> Light Mode</>}</button>
            {user ? (
              <>
                <Link to={`/user/${user.id}`} className="block py-2 text-sm font-medium text-white">Profile</Link>
                <button onClick={handleLogout} className="flex items-center gap-2 py-2 text-sm font-medium text-red-400"><LogOut size={16}/> Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-sm font-medium text-white">Sign In</Link>
                <Link to="/register" className="block py-2 text-sm font-medium text-orange-accent">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;