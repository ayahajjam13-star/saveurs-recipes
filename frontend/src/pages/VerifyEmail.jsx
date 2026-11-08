import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';

function VerifyEmailBanner() {
  const { user, isEmailVerified } = useAuth();

  if (!user || isEmailVerified) return null;

  return (
    <div className="bg-guava-peach/50 border-b border-guava-pink/20 px-4 py-3 text-center relative z-[60] flex items-center justify-center gap-2">
      <AlertCircle size={16} className="text-guava-pink" />
      <p className="text-warm-brown font-sans text-sm font-medium">
        Please verify your email. <Link to="/verify-email" className="text-guava-pink underline font-bold hover:text-warm-brown transition-colors">Verify now</Link>
      </p>
    </div>
  );
}

export default VerifyEmailBanner;