
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
  CheckCircle2,
  Leaf,
  Heart,
  Utensils,
  ShieldCheck,
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
    'w-full h-[54px] pl-12 pr-12 rounded-xl border border-[#EDDFDA] bg-[#FCF8F7] text-[#5A3325] placeholder:text-[#B9A49C] outline-none transition-all duration-200 focus:border-[#C47558] focus:ring-4 focus:ring-[#EB9D81]/20 dark:bg-[#3D231A] dark:border-white/10 dark:text-white dark:placeholder:text-white/35';

  const labelClass =
    'block text-sm font-semibold text-[#5A3325] dark:text-white mb-2.5';

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FAF4F1] dark:bg-[#2F1911] px-4 py-8 sm:px-6 lg:py-12 transition-colors duration-300">

      {/* Background decoration */}
      <div className="absolute -top-40 -right-32 w-[500px] h-[500px] rounded-full bg-[#EDC7B9]/60 dark:bg-[#5A3325]/30 blur-3xl pointer-events-none" />
      <div className="absolute top-[45%] -left-40 w-[400px] h-[400px] rounded-full bg-[#E6D6C6]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 right-[25%] w-[450px] h-[450px] rounded-full bg-[#ECE0CD]/25 blur-3xl pointer-events-none" />

      {/* Decorative circles */}
      <div className="absolute top-28 left-[8%] hidden xl:block w-4 h-4 rounded-full bg-[#EB9D81]/70" />
      <div className="absolute top-[38%] right-[7%] hidden xl:block w-6 h-6 rounded-full border-2 border-[#E6D6C6]/60" />
      <div className="absolute bottom-28 left-[15%] hidden xl:block w-3 h-3 rounded-full bg-[#ECE0CD]" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <header className="flex items-center justify-between mb-12 lg:mb-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-[17px] bg-[#5A3325] text-white flex items-center justify-center shadow-lg shadow-[#5A3325]/15 group-hover:rotate-6 transition-transform">
              <ChefHat size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-[#5A3325] dark:text-white">
                Saveurs<span className="text-[#C47558]">.</span>
              </h1>
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#A9897D]">
                Cook · Discover · Enjoy
              </p>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-sm text-[#8C6F65] dark:text-[#EDC7B9]">
            <span>Already a member?</span>
            <Link
              to="/login"
              className="font-bold text-[#98543B] hover:text-[#5A3325] dark:hover:text-[#EB9D81] transition-colors"
            >
              Sign in
            </Link>
            <ArrowRight size={15} />
          </div>
        </header>

        {/* Main content */}
        <section className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-center max-w-6xl mx-auto">

          {/* Left introduction */}
          <div className="max-w-xl text-center lg:text-left">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 border border-[#EDC7B9] dark:border-white/10 text-[#98543B] text-xs font-bold tracking-wider shadow-sm mb-7">
              <Sparkles size={15} />
              A COMMUNITY MADE FOR FOOD LOVERS
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-[58px] font-black leading-[1.12] tracking-tight text-[#5A3325] dark:text-white">
              Your kitchen.
              <br />
              Your creativity.
              <br />
              <span className="text-[#98543B]">Your Saveurs.</span>
            </h2>

            <p className="mt-6 text-[#8C6F65] dark:text-white/60 text-base sm:text-lg leading-8 max-w-md mx-auto lg:mx-0">
              Create your account and bring more inspiration to your kitchen.
              Discover recipes, plan your meals and save the flavors you love.
            </p>

            {/* Benefits */}
            <div className="mt-9 grid gap-4 max-w-md mx-auto lg:mx-0 text-left">

              <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/65 dark:bg-white/5 border border-white dark:border-white/10">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-[#EDC7B9]/60 flex items-center justify-center text-[#98543B]">
                  <Heart size={21} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#5A3325] dark:text-white">
                    Save what you love
                  </p>
                  <p className="text-xs text-[#A3877D] mt-1">
                    Keep your favorite recipes close.
                  </p>
                </div>
                <CheckCircle2 size={18} className="ml-auto text-[#C47558]" />
              </div>

              <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/65 dark:bg-white/5 border border-white dark:border-white/10">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-[#E6D6C6]/35 flex items-center justify-center text-[#9F8E7C]">
                  <Utensils size={21} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#5A3325] dark:text-white">
                    Organize your meals
                  </p>
                  <p className="text-xs text-[#A3877D] mt-1">
                    Make everyday cooking easier.
                  </p>
                </div>
                <CheckCircle2 size={18} className="ml-auto text-[#C47558]" />
              </div>

              <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/65 dark:bg-white/5 border border-white dark:border-white/10">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-[#ECE0CD]/45 flex items-center justify-center text-[#AA9678]">
                  <Leaf size={21} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#5A3325] dark:text-white">
                    Discover new flavors
                  </p>
                  <p className="text-xs text-[#A3877D] mt-1">
                    Find inspiration for every occasion.
                  </p>
                </div>
                <CheckCircle2 size={18} className="ml-auto text-[#C47558]" />
              </div>

            </div>

            <div className="hidden lg:flex items-center gap-3 mt-10 text-[#A3877D]">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#EDC7B9] border-2 border-[#FAF4F1]" />
                <div className="w-8 h-8 rounded-full bg-[#ECE0CD] border-2 border-[#FAF4F1]" />
                <div className="w-8 h-8 rounded-full bg-[#E6D6C6] border-2 border-[#FAF4F1]" />
              </div>
              <span className="text-xs font-medium">
                A little inspiration makes every meal special.
              </span>
            </div>
          </div>

          {/* Registration card */}
          <div className="w-full max-w-[520px] mx-auto lg:ml-auto">

            <div className="relative">

              <div className="absolute -top-5 -right-4 w-20 h-20 rounded-full bg-[#EB9D81]/40 blur-2xl" />
              <div className="absolute -bottom-6 -left-5 w-24 h-24 rounded-full bg-[#ECE0CD]/50 blur-2xl" />

              <div className="relative bg-white dark:bg-[#3D231A] rounded-[18px] sm:rounded-[18px] p-6 sm:p-9 lg:p-10 border border-[#F0E2DD] dark:border-white/10 shadow-[0_25px_80px_rgba(90,51,37,0.10)]">

                {/* Form heading */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#F8ECE8] dark:bg-[#5A3325] flex items-center justify-center text-[#98543B]">
                      <ChefHat size={24} />
                    </div>

                    <span className="px-3 py-1.5 rounded-full bg-[#F8ECE8] dark:bg-white/5 text-[#98543B] text-[10px] font-bold uppercase tracking-wider">
                      Free account
                    </span>
                  </div>

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B37057] mb-2">
                    LET'S GET STARTED
                  </p>

                  <h2 className="text-3xl sm:text-4xl font-black text-[#5A3325] dark:text-white tracking-tight">
                    Create account
                  </h2>

                  <p className="text-sm text-[#A79189] dark:text-white/50 mt-2">
                    Join Saveurs and start your food journey.
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 text-sm"
                  >
                    <ShieldCheck size={18} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Name */}
                  <div>
                    <label className={labelClass}>
                      Full name
                    </label>

                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AC8E83]"
                      />

                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoComplete="name"
                        className={inputClass}
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className={labelClass}>
                      Email address
                    </label>

                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AC8E83]"
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
                    <label className={labelClass}>
                      Password
                    </label>

                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AC8E83]"
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
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#AC8E83] hover:text-[#98543B] transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className={labelClass}>
                      Confirm password
                    </label>

                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AC8E83]"
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
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#AC8E83] hover:text-[#98543B] transition-colors"
                      >
                        {showConfirmation ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full min-h-[56px] mt-3 flex items-center justify-center gap-3 rounded-xl bg-[#5A3325] hover:bg-[#794836] text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-[#5A3325]/15 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {loading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create my account
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                </form>

                {/* Login */}
                <div className="mt-7 pt-6 border-t border-[#F2E9E5] dark:border-white/10 text-center">
                  <p className="text-sm text-[#A28A82] dark:text-white/50">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="font-bold text-[#98543B] hover:text-[#5A3325] dark:hover:text-[#EB9D81] transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>

              </div>
            </div>

            {/* Bottom note */}
            <div className="flex items-center justify-center gap-2 mt-6 text-[#AB948C] dark:text-white/40">
              <ShieldCheck size={15} />
              <p className="text-[11px] text-center">
                Your culinary journey starts with Saveurs.
              </p>
            </div>

          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 lg:mt-20 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#F0E2DD] dark:border-white/10 pt-6">
          <p className="text-xs text-[#AB948C] dark:text-white/40">
            © {new Date().getFullYear()} Saveurs. Cook with love.
          </p>

          <Link
            to="/"
            className="text-xs font-semibold text-[#98543B] hover:text-[#5A3325] dark:hover:text-[#EB9D81] transition-colors"
          >
            Back to homepage
          </Link>
        </footer>

      </div>
    </main>
  );
}

export default Register;
