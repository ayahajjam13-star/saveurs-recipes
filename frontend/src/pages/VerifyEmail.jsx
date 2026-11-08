
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, ArrowRight, MailCheck } from 'lucide-react';

function VerifyEmailBanner() {
  const { user, isEmailVerified } = useAuth();

  if (!user || isEmailVerified) return null;

  return (
    <div className="relative z-[60] overflow-hidden bg-[#F5D8C8]/60 border-b border-[#E88FA5]/20 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3">

        <div className="w-8 h-8 rounded-full bg-[#E88FA5]/15 flex items-center justify-center shrink-0">
          <AlertCircle size={17} className="text-[#C96F88]" />
        </div>

        <p className="text-sm text-[#1A1512] text-center">
          <span className="font-semibold">Verify your email address</span>
          <span className="hidden sm:inline text-[#1A1512]/60">
            {' '}— Complete your account setup to enjoy all Saveurs features.
          </span>
        </p>

        <Link
          to="/verify-email"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E88FA5] text-white text-xs font-bold hover:bg-[#D77C94] transition-all shadow-sm hover:shadow-md"
        >
          <MailCheck size={14} />
          Verify now
          <ArrowRight size={13} />
        </Link>

      </div>
    </div>
  );
}

export default VerifyEmailBanner;
