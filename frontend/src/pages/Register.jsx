import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, ChefHat } from 'lucide-react';

function Register() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, passwordConfirmation);
      navigate('/');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        setError(Object.values(errors).flat().join(' '));
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
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
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2000&auto=format&fit=crop"
            alt="Cooking"
            className="w-full h-full object-cover"
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
              Start your culinary <br/> journey today.
            </h2>
            <p className="text-white/70 text-lg max-w-md">
              Create an account to save your favorite recipes, plan your meals, and share your passion for food.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 py-12">
        <div className="w-full max-w-md animate-fade-in">
          
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl font-bold text-[#2C1E16] dark:text-dark-text mb-2">
              Create Account
            </h1>
            <p className="text-[#2C1E16]/60 dark:text-dark-text/60">
              Join our community of food lovers.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2C1E16] dark:text-dark-text mb-1.5">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-3.5 text-[#2C1E16]/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#2C1E16]/10 dark:border-dark-text/10 bg-white dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-orange-accent/30 focus:border-orange-accent text-[#2C1E16] dark:text-dark-text transition-all"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C1E16] dark:text-dark-text mb-1.5">Email Address</label>
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
              <label className="block text-sm font-medium text-[#2C1E16] dark:text-dark-text mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-3.5 text-[#2C1E16]/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-[#2C1E16]/10 dark:border-dark-text/10 bg-white dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-orange-accent/30 focus:border-orange-accent text-[#2C1E16] dark:text-dark-text transition-all"
                  placeholder="At least 6 characters"
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

            <div>
              <label className="block text-sm font-medium text-[#2C1E16] dark:text-dark-text mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-3.5 text-[#2C1E16]/40" />
                <input
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#2C1E16]/10 dark:border-dark-text/10 bg-white dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-orange-accent/30 focus:border-orange-accent text-[#2C1E16] dark:text-dark-text transition-all"
                  placeholder="Repeat your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-orange-accent text-white rounded-xl font-bold tracking-wide hover:bg-[#2C1E16] transition-all disabled:opacity-50 mt-4"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-[#2C1E16]/60 dark:text-dark-text/60 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-accent font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;