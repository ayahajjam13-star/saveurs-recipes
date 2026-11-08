
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Mail,
  ArrowRight,
  X,
  Sparkles
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

function VerifyEmailBanner() {
  const { user, isEmailVerified } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (!user || isEmailVerified || dismissed) {
    return null;
  }

  return (
    <div className="relative z-[60] px-4 pt-3">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-[#E88FA5]/25 bg-[#FFFEFC] shadow-lg shadow-[#28221E]/5 dark:bg-[#28221E]">

        {/* Decorative background */}
        <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[#E88FA5]/10 blur-2xl" />
        <div className="absolute -bottom-12 left-1/3 h-28 w-28 rounded-full bg-[#718B68]/10 blur-2xl" />

        <div className="relative flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

          {/* Message */}
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E88FA5]/15 text-[#D77F96]">
              <Mail size={21} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-serif text-base font-bold text-[#28221E] dark:text-[#FAF7F0]">
                  One little step left!
                </h3>

                <Sparkles
                  size={14}
                  className="text-[#E88FA5]"
                />
              </div>

              <p className="mt-1 text-xs leading-relaxed text-[#8B8179] dark:text-[#B9ADA3] sm:text-sm">
                Please verify your email address to unlock all Saveurs features.
              </p>
            </div>

          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-3 pl-14 sm:pl-0">

            <Link
              to="/verify-email"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#E88FA5] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#E88FA5]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#D77F96] hover:shadow-lg"
            >
              Verify email
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss notification"
              title="Dismiss"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#8B8179] transition-colors hover:bg-[#E88FA5]/10 hover:text-[#D77F96]"
            >
              <X size={17} />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailBanner;
