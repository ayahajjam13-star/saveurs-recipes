import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, ChefHat } from 'lucide-react';

function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAF7F0] dark:bg-dark-bg transition-colors">
      
      {/* Left Side: Image & Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=2000&auto=format&fit=crop"
            alt="Cooking"
            className="w-full h-full object-cover animate-[slowZoom_20s_ease-in-out_infinite]"
          />
          <div className="absolute inset-0 bg-[#2C1E16]/70 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C1E16]/90 to-transparent"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-16 h-full w-full">
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <ChefHat size={40} className="text-orange-accent" />
            <div>
              <h1 className="font-serif text-3xl font-bold text-white leading-none">Saveurs</h1>
              <p className="text-[10px] text-white/70 tracking-widest uppercase mt-1">Recipes</p>
            </div>
          </Link>
          
          <div>
            <h2 className="font-serif text-5xl text-white leading-tight mb-4">
              Good food brings <br/> people together.
            </h2>
            <p className="text-white/70 text-lg max-w-md">
              Join our community of food lovers and discover amazing recipes from around the world.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
        <div className="w-full max-w-md animate-fade-in">
          
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl font-bold text-[#2C1E16] dark:text-dark-text mb-2">
              Welcome Back
            </h1>
            <p className="text-[#2C1E16]/60 dark:text-dark-text/60">
              Sign in to continue your culinary journey.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#2C1E16] dark:text-dark-text mb-2">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-3.5 text-[#2C1E16]/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#2C1E16]/10 dark:border-dark-text/10 bg-white dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-orange-accent/30 focus:border-orange-accent text-[#2C1E16] dark:text-dark-text transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-[#2C1E16] dark:text-dark-text">Password</label>
                <a href="#" className="text-xs text-orange-accent font-medium hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-3.5 text-[#2C1E16]/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-[#2C1E16]/10 dark:border-dark-text/10 bg-white dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-orange-accent/30 focus:border-orange-accent text-[#2C1E16] dark:text-dark-text transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-[#2C1E16]/40 hover:text-[#2C1E16] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-orange-accent text-white rounded-xl font-bold tracking-wide hover:bg-[#2C1E16] transition-all disabled:opacity-50 mt-4"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2C1E16]/10 dark:border-dark-text/10"></div>
            </div>
            <div className="relative flex justify-center text-xs tracking-widest uppercase text-[#2C1E16]/40">
              <span className="px-4 bg-[#FAF7F0] dark:bg-dark-bg">Or continue with</span>
            </div>
          </div>

          <a
            href={`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'}/auth/google/redirect`}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-white dark:bg-dark-bg border border-[#2C1E16]/10 dark:border-dark-text/10 text-[#2C1E16] dark:text-dark-text rounded-xl font-medium hover:bg-[#FAF7F0] dark:hover:bg-dark-card transition-all shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </a>

          <p className="mt-8 text-center text-[#2C1E16]/60 dark:text-dark-text/60 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-orange-accent font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;