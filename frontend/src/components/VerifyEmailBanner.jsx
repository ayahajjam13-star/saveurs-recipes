
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './VerifyEmailBanner.css';

import {
  Mail,
  ArrowRight,
  X,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

function VerifyEmailBanner() {
  const { user, isEmailVerified } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (!user || isEmailVerified || dismissed) {
    return null;
  }

  return (
    <div className="verify-banner-wrapper">
      <div className="verify-banner">

        {/* Decorative Background */}
        <div className="verify-decoration verify-decoration-one" />
        <div className="verify-decoration verify-decoration-two" />
        <div className="verify-decoration verify-decoration-three" />

        <div className="verify-banner-content">

          {/* Icon */}
          <div className="verify-icon-wrapper">
            <div className="verify-icon">
              <Mail size={23} strokeWidth={1.8} />
            </div>

            <span className="verify-icon-sparkle">
              <Sparkles size={12} />
            </span>
          </div>

          {/* Message */}
          <div className="verify-message">
            <div className="verify-title-row">
              <span className="verify-eyebrow">
                ACCOUNT SECURITY
              </span>

              <span className="verify-status">
                <span className="verify-status-dot" />
                Pending
              </span>
            </div>

            <h3>
              One little step left!
              <Sparkles size={16} />
            </h3>

            <p>
              Please verify your email address to unlock all
              Saveurs features and enjoy your cooking journey.
            </p>
          </div>

          {/* Actions */}
          <div className="verify-actions">
            <Link
              to="/verify-email"
              className="verify-action-button"
            >
              <ShieldCheck size={17} />
              <span>Verify email</span>

              <ArrowRight
                size={16}
                className="verify-arrow"
              />
            </Link>

            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss notification"
              title="Dismiss"
              className="verify-dismiss-button"
            >
              <X size={18} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default VerifyEmailBanner;
