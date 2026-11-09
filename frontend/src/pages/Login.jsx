import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';
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
  Leaf,
  ArrowUpRight,
  ShieldCheck,
  Stars,
} from 'lucide-react';

import './Login.css';

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
    <main className="login-page">

      {/* Decorative background */}
      <div className="login-bg-orb login-orb-one" />
      <div className="login-bg-orb login-orb-two" />
      <div className="login-bg-grid" />

      <div className="login-layout">

        {/* LEFT: VISUAL BRANDING */}
        <section className="login-visual">

          <div className="login-visual-image">
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=85&w=1800&auto=format&fit=crop"
              alt="Chef preparing a delicious meal"
            />
          </div>

          <div className="login-visual-overlay" />

          {/* Top branding */}
          <div className="login-brand-top">

            <Link to="/" className="login-brand">
              <div className="login-brand-icon">
                <ChefHat size={27} strokeWidth={1.8} />
              </div>

              <div>
                <span className="login-brand-name">Saveurs</span>
                <span className="login-brand-subtitle">
                  THE ART OF TASTE
                </span>
              </div>
            </Link>

            <div className="login-brand-label">
              <span className="login-live-dot" />
              A WORLD OF FLAVORS
            </div>

          </div>

          {/* Main visual content */}
          <div className="login-visual-content">

            <div className="login-visual-eyebrow">
              <Sparkles size={15} />
              <span>YOUR TABLE, YOUR STORY</span>
            </div>

            <h2>
              Every dish
              <br />
              tells a <em>beautiful</em>
              <br />
              story.
            </h2>

            <p>
              Discover inspiring recipes, explore new flavors
              and turn everyday cooking into something special.
            </p>

            <div className="login-visual-bottom">

              <div className="login-visual-features">

                <div className="login-feature">
                  <span className="login-feature-icon">
                    <UtensilsCrossed size={17} />
                  </span>
                  <span>Discover recipes</span>
                </div>

                <div className="login-feature">
                  <span className="login-feature-icon">
                    <Heart size={17} />
                  </span>
                  <span>Save your favorites</span>
                </div>

              </div>

              <div className="login-photo-caption">
                <span>01 / 03</span>
                <div />
                <span>COOK WITH LOVE</span>
              </div>

            </div>

          </div>

          {/* Floating recipe card */}
          <div className="login-floating-card">

            <div className="login-floating-image">
              <img
                src="https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=300&auto=format&fit=crop"
                alt="Fresh healthy salad"
              />
            </div>

            <div className="login-floating-info">
              <span>FRESH INSPIRATION</span>
              <strong>Made with love</strong>
              <div className="login-floating-rating">
                <Stars size={13} />
                <span>Explore something new</span>
              </div>
            </div>

            <div className="login-floating-arrow">
              <ArrowUpRight size={17} />
            </div>

          </div>

          <div className="login-visual-footer">
            <span>© {new Date().getFullYear()} SAVEURS</span>
            <span>GOOD FOOD. GOOD MOOD.</span>
          </div>

        </section>

        {/* RIGHT: LOGIN FORM */}
        <section className="login-form-side">

          <div className="login-form-top">
            <Link to="/" className="login-mobile-brand">
              <div className="login-brand-icon">
                <ChefHat size={24} />
              </div>
              <span>Saveurs</span>
            </Link>

            <div className="login-top-message">
              <span>NEW HERE?</span>
              <Link to="/register">
                Create account <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>

          <div className="login-form-container">

            {/* Form heading */}
            <div className="login-heading">

              <div className="login-heading-icon">
                <Sparkles size={22} />
              </div>

              <span className="login-overline">
                YOUR KITCHEN IS WAITING
              </span>

              <h1>
                Welcome <em>back.</em>
              </h1>

              <p>
                Sign in to continue your culinary journey
                and discover your next favorite recipe.
              </p>

            </div>

            {/* Error */}
            {error && (
              <div className="login-error" role="alert">
                <span className="login-error-icon">!</span>
                <p>{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="login-form">

              {/* Email */}
              <div className="login-field">

                <label htmlFor="email">
                  Email address
                </label>

                <div className="login-input-wrapper">
                  <Mail size={19} className="login-input-icon" />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                  />

                  {email && (
                    <span className="login-input-check">
                      <ShieldCheck size={17} />
                    </span>
                  )}
                </div>

              </div>

              {/* Password */}
              <div className="login-field">

                <div className="login-label-row">
                  <label htmlFor="password">
                    Password
                  </label>
                </div>

                <div className="login-input-wrapper">
                  <Lock size={19} className="login-input-icon" />

                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    className="login-password-toggle"
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
                className="login-submit"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={20} className="animate-spin" />
                    Signing you in...
                  </>
                ) : (
                  <>
                    <span>Sign in to Saveurs</span>
                    <span className="login-submit-arrow">
                      <ArrowRight size={19} />
                    </span>
                  </>
                )}
              </button>

            </form>

            {/* Divider */}
            <div className="login-divider">
              <span />
              <p>OR CONTINUE WITH</p>
              <span />
            </div>

            {/* Google */}
            <a
              href={`${API_URL}/auth/google/redirect`}
              className="login-google-button"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>

              Continue with Google
              <ArrowUpRight size={17} className="login-google-arrow" />
            </a>

            {/* Register mobile */}
            <div className="login-register-mobile">
              Don't have an account?
              <Link to="/register">Create one</Link>
            </div>

            {/* Trust note */}
            <div className="login-security-note">
              <ShieldCheck size={16} />
              <span>Your account and personal information are protected.</span>
            </div>

          </div>

          <div className="login-form-footer">
            <span>MADE WITH</span>
            <Heart size={13} fill="currentColor" />
            <span>FOR FOOD LOVERS</span>
          </div>

        </section>

      </div>
    </main>
  );
}

export default Login;