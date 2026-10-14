import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

function Register() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, passwordConfirmation);
      navigate('/');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        setError(Object.values(errors).flat().join(' '));
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-cream dark:bg-dark-bg transition-colors">
      <div className="w-full max-w-md animate-fade-in">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-accent rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">🍽️</div>
          <h1 className="font-serif text-4xl font-bold text-warm-brown dark:text-dark-text mb-2">
            {t('auth.createAccount')}
          </h1>
          <p className="text-warm-brown/60 dark:text-dark-text/60">{t('auth.registerText')}</p>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-warm-brown/5 dark:border-dark-text/5 p-8 transition-colors">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-warm-brown dark:text-dark-text mb-2">
                {t('auth.name')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-warm-brown/10 dark:border-dark-text/10 bg-cream/50 dark:bg-dark-bg/50 focus:outline-none focus:ring-2 focus:ring-orange-accent/30 focus:border-orange-accent text-warm-brown dark:text-dark-text transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-brown dark:text-dark-text mb-2">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-warm-brown/10 dark:border-dark-text/10 bg-cream/50 dark:bg-dark-bg/50 focus:outline-none focus:ring-2 focus:ring-orange-accent/30 focus:border-orange-accent text-warm-brown dark:text-dark-text transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-brown dark:text-dark-text mb-2">
                {t('auth.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-warm-brown/10 dark:border-dark-text/10 bg-cream/50 dark:bg-dark-bg/50 focus:outline-none focus:ring-2 focus:ring-orange-accent/30 focus:border-orange-accent text-warm-brown dark:text-dark-text transition-colors"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-brown dark:text-dark-text mb-2">
                {t('auth.confirmPassword')}
              </label>
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-warm-brown/10 dark:border-dark-text/10 bg-cream/50 dark:bg-dark-bg/50 focus:outline-none focus:ring-2 focus:ring-orange-accent/30 focus:border-orange-accent text-warm-brown dark:text-dark-text transition-colors"
                placeholder="Repeat your password"
              />
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 bg-orange-accent text-white rounded-xl font-medium hover:bg-orange-accent/90 transition-colors disabled:opacity-50">
              {loading ? t('auth.creating') : t('auth.createButton')}
            </button>
          </form>

          <p className="mt-6 text-center text-warm-brown/60 dark:text-dark-text/60 text-sm">
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="text-orange-accent font-medium hover:underline">
              {t('auth.signInLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;