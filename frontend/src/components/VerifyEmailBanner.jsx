import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function VerifyEmailBanner() {
  const { user, isEmailVerified } = useAuth();

  if (!user || isEmailVerified) return null;

  return (
    <div className="bg-orange-accent/10 border-b border-orange-accent/20 px-4 py-2 text-center text-xs relative z-[60]">
      <p className="text-orange-accent font-medium">
        ⚠️ Please verify your email. <Link to="/verify-email" className="underline font-bold">Verify now</Link>
      </p>
    </div>
  );
}

export default VerifyEmailBanner;