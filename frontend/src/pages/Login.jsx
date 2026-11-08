
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ChefHat,
  ArrowRight,
  LoaderCircle,
  Sparkles,
  Heart,
  UtensilsCrossed,
} from 'lucide-react';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function Login() {
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
      navigate('/', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Login failed. Please check your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAF7F0] transition-colors dark:bg-[#1A1512]">

      {/* Left Side - Branding */}
      <section className="relative hidden w-1/2 overflow-hidden lg:flex">

        <img
          src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=2000&auto=format&fit=crop"
          alt="Delicious food preparation"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[#1A1512]/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1512] via-transparent to-[#1A1512]/30" />

        {/* Decorative circles */}
        <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-[#E88FA5]/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-[#718B68]/20 blur-3xl" />

        <div className="relative z-10 flex h-full w-full flex-col justify-between p-12 xl:p-16">

          {/* Logo */}
          <Link to="/" className="group flex w-fit items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E88FA5] text-white shadow-lg shadow-[#E88FA5]/20 transition-transform group-hover:rotate-6">
              <ChefHat size={32} />
            </div>

            <div>
              <h1 className="font-serif text-3xl font-bold leading-none text-white">
                Saveurs
              </h1>
              <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-[#F5D8C8]/80">
                Taste the happiness
              </p>
            </div>
          </Link>

          {/* Main Text */}
          <div className="max-w-xl pb-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F5D8C8]/20 bg-white/10 px-4 py-2 text-sm text-[#F5D8C8] backdrop-blur-sm">
              <Sparkles size={16} />
              A world of flavors awaits you
            </div>

            <h2 className="mb-6 font-serif text-4xl font-bold leading-tight text-white xl:text-6xl">
              Good food brings
              <span className="block text-[#E88FA5]">
                people together.
              </span>
            </h2>

            <p className="max-w-md text-base leading-8 text-white/70 xl:text-lg">
              Discover delicious recipes, save your favorites, and
              share your passion for cooking with our food-loving
              community.
            </p>

            <div className="mt-9 flex items-center gap-5">
              <div className="flex -space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#1A1512] bg-[#E88FA5] text-white">
                  <Heart size={17} />
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#1A1512] bg-[#718B68] text-white">
                  <ChefHat size={17} />
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#1A1512] bg-[#F5D8C8] text-[#1A1512]">
                  <UtensilsCrossed size={17} />
                </div>
              </div>

              <p className="text-sm text-white/60">
                Made for people who love good food.
              </p>
            </div>
          </div>

          <p className="text-xs tracking-wide text-white/40">
            © {new Date().getFullYear()} Saveurs. Made with love.
          </p>
        </div>
      </section>

      {/* Right Side - Login Form */}
      <section className="flex w-full items-center justify-center px-5 py-12 sm:px-10 lg:w-1/2 lg:px-12 xl:px-20">

        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <Link to="/" className="mb-12 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E88FA5] text-white">
              <ChefHat size={27} />
            </div>
            <span className="font-serif text-3xl font-bold text-[#1A1512] dark:text-[#FAF7F0]">
              Saveurs
            </span>
          </Link>

          {/* Heading */}
          <div className="mb-9">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E88FA5]/15 text-[#E88FA5]">
              <ChefHat size={25} />
            </div>

            <h1 className="mb-3 font-serif text-3xl font-bold text-[#1A1512] dark:text-[#FAF7F0] sm:text-4xl">
              Welcome Back!
            </h1>

            <p className="leading-7 text-[#1A1512]/55 dark:text-[#FAF7F0]/55">
              Sign in to continue your culinary journey.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400"
            >
              <span className="font-bold">!</span>
              <p>{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#1A1512] dark:text-[#FAF7F0]"
              >
                Email Address
              </label>

              <div className="group relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718B68] transition-colors group-focus-within:text-[#E88FA5]"
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-[#718B68]/20 bg-white py-4 pl-12 pr-4 text-[#1A1512] outline-none transition-all placeholder:text-[#1A1512]/30 focus:border-[#E88FA5] focus:ring-4 focus:ring-[#E88FA5]/10 dark:bg-[#28221E] dark:text-[#FAF7F0] dark:placeholder:text-[#FAF7F0]/30"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#1A1512] dark:text-[#FAF7F0]"
              >
                Password
              </label>

              <div className="group relative">
                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718B68] transition-colors group-focus-within:text-[#E88FA5]"
                />

                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-[#718B68]/20 bg-white py-4 pl-12 pr-12 text-[#1A1512] outline-none transition-all placeholder:text-[#1A1512]/30 focus:border-[#E88FA5] focus:ring-4 focus:ring-[#E88FA5]/10 dark:bg-[#28221E] dark:text-[#FAF7F0] dark:placeholder:text-[#FAF7F0]/30"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#718B68] transition-colors hover:text-[#E88FA5]"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group mt-3 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#E88FA5] py-4 font-bold tracking-wide text-white shadow-lg shadow-[#E88FA5]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#dc7e95] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle size={20} className="animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#718B68]/20" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#1A1512]/35 dark:text-[#FAF7F0]/35">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-[#718B68]/20" />
          </div>

          {/* Google Login */}
          <a
            href={`${API_URL}/auth/google/redirect`}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#718B68]/20 bg-white py-4 font-semibold text-[#1A1512] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#E88FA5]/50 hover:bg-[#F5D8C8]/30 dark:bg-[#28221E] dark:text-[#FAF7F0] dark:hover:bg-[#1A1512]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </a>

          {/* Register Link */}
          <p className="mt-9 text-center text-sm text-[#1A1512]/55 dark:text-[#FAF7F0]/55">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-[#E88FA5] transition-colors hover:text-[#718B68]"
            >
              Create an account
            </Link>
          </p>

          {/* Bottom Note */}
          <div className="mt-10 flex items-center justify-center gap-2 text-xs text-[#718B68]/70">
            <Heart size={14} />
            <span>Good food, good mood, good memories.</span>
          </div>

        </div>
      </section>
    </div>
  );
}

export default Login;
