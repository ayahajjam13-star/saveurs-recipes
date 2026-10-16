import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function VerifyEmailBanner() {
  const { user, isEmailVerified } = useAuth();

  if (!user || isEmailVerified) return null;

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800/50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          ⚠️ Please verify your email address to unlock all features.
        </p>
        <Link
          to="/verify-email"
          className="text-sm font-medium text-yellow-900 dark:text-yellow-100 underline hover:no-underline"
        >
          Verify now →
        </Link>
      </div>
    </div>
  );
}

export default VerifyEmailBanner;