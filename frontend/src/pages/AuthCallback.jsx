import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChefHat, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './AuthCallback.css';

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const handleGoogleCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        toast.error(`Login failed: ${error}`);
        navigate('/login', { replace: true });
        return;
      }

      if (!token) {
        toast.error('Login failed. Please try again.');
        navigate('/login', { replace: true });
        return;
      }

      try {
        await loginWithToken(token);

        if (!isMounted) return;

        toast.success('Logged in with Google! 🎉');
        navigate('/', { replace: true });
      } catch (err) {
        if (!isMounted) return;

        console.error('Google login error:', err);
        toast.error('Google login failed. Please try again.');
        navigate('/login', { replace: true });
      }
    };

    handleGoogleCallback();

    return () => {
      isMounted = false;
    };
  }, [searchParams, navigate, loginWithToken]);

  return (
    <div className="auth-callback-page">

      <div className="auth-callback-decoration auth-decoration-one" />
      <div className="auth-callback-decoration auth-decoration-two" />
      <div className="auth-callback-decoration auth-decoration-three" />

      <div className="auth-callback-card">

        <div className="auth-callback-logo">
          <ChefHat size={34} strokeWidth={1.7} />
          <div className="auth-logo-sparkle">
            <Sparkles size={15} />
          </div>
        </div>

        <div className="auth-callback-badge">
          <span className="auth-callback-status-dot" />
          SECURE AUTHENTICATION
        </div>

        <h1>
          Welcome to <span>Saveurs</span>
        </h1>

        <p className="auth-callback-description">
          We're preparing your kitchen experience.
          Just a moment while we securely sign you in.
        </p>

        <div className="auth-callback-loader">
          <div className="auth-loader-circle" />
          <div className="auth-loader-icon">
            <ChefHat size={23} />
          </div>
        </div>

        <p className="auth-callback-loading-text">
          Signing you in<span className="auth-loading-dots">...</span>
        </p>

        <div className="auth-callback-divider" />

        <div className="auth-callback-footer">
          <Sparkles size={13} />
          <span>Good food, good mood.</span>
          <Sparkles size={13} />
        </div>

      </div>
    </div>
  );
}

export default AuthCallback;