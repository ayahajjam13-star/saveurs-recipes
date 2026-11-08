
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

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
    <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-dark-bg">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-orange-accent/30 border-t-orange-accent rounded-full animate-spin"></div>

        <p className="mt-4 text-warm-brown dark:text-dark-text">
          Signing you in...
        </p>
      </div>
    </div>
  );
}

export default AuthCallback;
