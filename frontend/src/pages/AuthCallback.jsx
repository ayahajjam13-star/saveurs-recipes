import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Login failed: ' + decodeURIComponent(error));
      navigate('/login');
      return;
    }

    if (token) {
      loginWithToken(token);
      toast.success('Logged in with Google! 🎉');
      navigate('/');
    } else {
      toast.error('Login failed');
      navigate('/login');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-dark-bg">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-orange-accent/30 border-t-orange-accent rounded-full animate-spin"></div>
        <p className="mt-4 text-warm-brown dark:text-dark-text">Signing you in...</p>
      </div>
    </div>
  );
}

export default AuthCallback;