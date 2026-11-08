
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ChefHat,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

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
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
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
        setError(
          err.response?.data?.message ||
          'Registration failed. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full pl-12 pr-12 py-4 rounded-2xl border border-[#718B68]/20 dark:border-white/10 bg-[#FAF7F0] dark:bg-[#1A1512] focus:outline-none focus:ring-2 focus:ring-[#E88FA5]/30 focus:border-[#E88FA5] text-[#1A1512] dark:text-white placeholder:text-[#718B68]/50 transition-all';

  const labelClass =
    'block text-sm font-sans font-bold text-[#1A1512] dark:text-white mb-2';

  return (
    <div className="min-h-screen flex bg-[#FAF7F0] dark:bg-[#1A1512] transition-colors">

      {/* Left Side - Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2000&auto=format&fit=crop"
          alt="Fresh cooking ingredients"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-[#1A1512]/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1512] via-transparent to-[#1A1512]/30" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 h-full w-full">

          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-12 h-12 rounded-2xl bg-[#E88FA5] flex items-center justify-center text-white">
              <ChefHat size={27} />
            </div>

            <div>
              <h1 className="font-serif text-3xl font-bold text-white leading-none">
                Saveurs
              </h1>
              <p className="text-[10px] text-[#F5D8C8] tracking-[0.3em] uppercase mt-2">
                A world of flavors
              </p>
            </div>
          </Link>

          <div className="max-w-lg">

            <div className="inline-flex items-center gap-2 text-[#F5D8C8] bg-white/10 px-4 py-2 rounded-full text-xs font-sans font-bold uppercase tracking-widest mb-7">
              <Sparkles size={14} />
              Welcome to Saveurs
            </div>

            <h2 className="font-serif text-5xl xl:text-6xl text-white leading-tight mb-6">
              Your next favorite dish starts here.
            </h2>

            <p className="text-white/70 text-lg leading-relaxed mb-10">
              Discover new recipes, organize your meals, and create
              beautiful moments around the table.
            </p>

            <div className="space-y-4">
              {[
                'Save your favorite recipes',
                'Plan your weekly meals',
                'Share your passion for cooking'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 text-white/90">
                  <CheckCircle2 size={19} className="text-[#E88FA5]" />
                  <span className="font-sans text-sm">{item}</span>
                </div>
              ))}
            </div>

          </div>

          <p className="text-white/40 text-xs font-sans tracking-widest uppercase">
            Cook • Discover • Enjoy
          </p>

        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-5 sm:px-10 py-12">

        <div className="w-full max-w-md">

          {/* Mobile Branding */}
          <Link to="/" className="lg:hidden flex items-center justify-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-xl bg-[#E88FA5] flex items-center justify-center text-white">
              <ChefHat size={23} />
            </div>
            <span className="font-serif text-2xl font-bold text-[#1A1512] dark:text-white">
              Saveurs
            </span>
          </Link>

          <div className="mb-9">

            <div className="w-12 h-1 bg-[#E88FA5] rounded-full mb-6" />

            <p className="text-[#718B68] font-sans text-xs font-bold uppercase tracking-[0.25em] mb-3">
              Join our community
            </p>

            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1A1512] dark:text-white mb-3">
              Create Account
            </h1>

            <p className="text-[#718B68] dark:text-gray-400">
              Create your account and start your culinary journey.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl text-red-600 dark:text-red-400 text-sm font-sans"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div>
              <label className={labelClass}>Full Name</label>

              <div className="relative">
                <User
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718B68]"
                />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className={inputClass}
                  placeholder="Your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>Email Address</label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718B68]"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={labelClass}>Password</label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718B68]"
                />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className={inputClass}
                  placeholder="At least 6 characters"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#718B68] hover:text-[#E88FA5] transition-colors"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className={labelClass}>Confirm Password</label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718B68]"
                />

                <input
                  type={showConfirmation ? 'text' : 'password'}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  autoComplete="new-password"
                  className={inputClass}
                  placeholder="Repeat your password"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmation(!showConfirmation)}
                  aria-label={showConfirmation ? 'Hide confirmation' : 'Show confirmation'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#718B68] hover:text-[#E88FA5] transition-colors"
                >
                  {showConfirmation ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 mt-3 bg-[#E88FA5] hover:bg-[#718B68] text-white rounded-2xl font-sans font-bold tracking-wide transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#E88FA5]/20 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={19} />
                </>
              )}
            </button>

          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-[#718B68] dark:text-gray-400 text-sm font-sans">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[#E88FA5] font-bold hover:text-[#718B68] transition-colors"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-10 text-center text-xs text-[#718B68]/60 font-sans">
            By joining Saveurs, you become part of our food-loving community.
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;
