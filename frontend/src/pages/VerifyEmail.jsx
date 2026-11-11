
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MailCheck,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

function VerifyEmailBanner() {
  const { user, isEmailVerified } = useAuth();

  if (!user || isEmailVerified) return null;

  return (
    <div className="relative z-[60] px-4 py-3 bg-gradient-to-r from-[#EDC7B9] via-[#F7EAE5] to-[#F4E4DE] dark:from-[#4A2D22] dark:via-[#422E27] dark:to-[#4A2D22] border-b border-[#EB9D81]/40 overflow-hidden">

      {/* Decorative elements */}
      <div className="absolute -top-10 right-[15%] w-28 h-28 rounded-full bg-white/30 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 left-[10%] w-32 h-32 rounded-full bg-[#EB9D81]/20 blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Message */}
          <div className="flex items-center gap-4 min-w-0">

            <div className="relative flex-shrink-0">

              <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-white/10 border border-white dark:border-white/10 shadow-sm flex items-center justify-center">
                <MailCheck
                  size={23}
                  className="text-[#98543B] dark:text-[#EDC7B9]"
                />
              </div>

              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ECE0CD] border-2 border-white dark:border-[#4A2D22] flex items-center justify-center">
                <AlertCircle size={11} className="text-[#9D8869]" />
              </span>

            </div>

            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-2 mb-1">

                <h3 className="text-sm font-bold text-[#5A3325] dark:text-white">
                  Your email is waiting!
                </h3>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/60 dark:bg-white/10 text-[#98543B] dark:text-[#EDC7B9] text-[9px] font-bold uppercase tracking-wider">
                  <Sparkles size={10} />
                  One last step
                </span>

              </div>

              <p className="text-xs sm:text-sm text-[#745043] dark:text-[#E5CEC6] leading-relaxed">
                Verify your email address to enjoy all Saveurs features.
              </p>

            </div>

          </div>

          {/* Action */}
          <div className="flex items-center gap-4 w-full sm:w-auto">

            <div className="hidden lg:flex items-center gap-2 text-xs text-[#98543B] dark:text-[#EDC7B9]">
              <ShieldCheck size={17} />
              <span>Secure your account</span>
            </div>

            <Link
              to="/verify-email"
              className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-[#5A3325] hover:bg-[#794836] text-white text-xs font-bold shadow-md shadow-[#5A3325]/15 hover:shadow-lg transition-all duration-300"
            >
              <MailCheck size={16} />
              Verify email
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
}

export default VerifyEmailBanner;
