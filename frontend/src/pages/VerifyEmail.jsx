import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function VerifyEmail() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/email/verification-notification`);
      toast.success('Verification email sent! Check your inbox.');
      setSent(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-cream dark:bg-dark-bg transition-colors">
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 bg-orange-accent/10 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
          ✉️
        </div>
        <h1 className="font-serif text-4xl font-bold text-warm-brown dark:text-dark-text mb-4">
          Verify your email
        </h1>
        <p className="text-warm-brown/60 dark:text-dark-text/60 mb-8">
          We've sent a verification link to <strong className="text-warm-brown dark:text-dark-text">{user?.email}</strong>. Please check your inbox and click the link to activate your account.
        </p>

        {sent ? (
          <div className="bg-fresh-green/10 border border-fresh-green/30 text-fresh-green rounded-2xl p-4 mb-6">
            ✅ Verification email sent! Check your inbox.
          </div>
        ) : null}

        <button
          onClick={handleResend}
          disabled={loading || sent}
          className="w-full py-3 bg-orange-accent text-white rounded-xl font-medium hover:bg-orange-accent/90 transition-colors disabled:opacity-50 mb-4"
        >
          {loading ? 'Sending...' : sent ? 'Email Sent ✓' : 'Resend Verification Email'}
        </button>

        <Link to="/" className="text-orange-accent text-sm hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

export default VerifyEmail;