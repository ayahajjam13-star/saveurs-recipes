import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/newsletter/subscribe`, { email });
      toast.success(res.data.message || 'Subscribed successfully! 🎉');
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Subscription failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-warm-brown dark:bg-[#1A1512] text-cream mt-20 transition-colors">
      
      {/* Newsletter Section */}
      <div className="border-b border-cream/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-serif text-4xl font-bold mb-4">
                {t('footer.newsletter') || 'Join our newsletter'}
              </h3>
              <p className="text-cream/60 text-lg font-light leading-relaxed">
                {t('footer.newsletterText') || 'Get the latest recipes and seasonal inspiration delivered straight to your inbox.'}
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.emailPlaceholder') || 'Enter your email address'}
                required
                disabled={loading || subscribed}
                className="flex-1 px-5 py-4 rounded-sm bg-transparent border border-cream/30 text-cream placeholder:text-cream/40 focus:outline-none focus:border-orange-accent transition-colors disabled:opacity-50"
              />
              <button 
                type="submit" 
                disabled={loading || subscribed}
                className="px-8 py-4 bg-orange-accent text-white rounded-sm text-sm font-bold tracking-widest uppercase hover:bg-orange-accent/90 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {loading ? '⏳' : subscribed ? '✓' : t('footer.subscribe') || 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <span className="font-serif text-4xl font-bold text-cream tracking-tight">
                Saveurs
              </span>
              <span className="block text-[10px] tracking-[0.25em] uppercase text-cream/60 mt-1">
                Recipes by Season
              </span>
            </Link>
            <p className="text-cream/60 text-sm leading-relaxed max-w-sm font-light mb-8">
              {t('footer.description') || 'Discover delicious recipes from around the world, carefully curated for every season. Cook with love, eat with joy.'}
            </p>
            
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-cream/20 hover:border-orange-accent hover:text-orange-accent flex items-center justify-center transition-colors text-sm">IG</a>
              <a href="#" className="w-10 h-10 rounded-full border border-cream/20 hover:border-orange-accent hover:text-orange-accent flex items-center justify-center transition-colors text-sm">FB</a>
              <a href="#" className="w-10 h-10 rounded-full border border-cream/20 hover:border-orange-accent hover:text-orange-accent flex items-center justify-center transition-colors text-sm">PT</a>
              <a href="#" className="w-10 h-10 rounded-full border border-cream/20 hover:border-orange-accent hover:text-orange-accent flex items-center justify-center transition-colors text-sm">YT</a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold tracking-widest uppercase text-sm mb-6 text-orange-accent">
              {t('footer.explore') || 'Explore'}
            </h4>
            <ul className="space-y-3 text-sm text-cream/70">
              <li><Link to="/" className="hover:text-orange-accent transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/search" className="hover:text-orange-accent transition-colors">{t('nav.search')}</Link></li>
              <li><Link to="/favorites" className="hover:text-orange-accent transition-colors">{t('nav.favorites')}</Link></li>
              <li><Link to="/about" className="hover:text-orange-accent transition-colors">{t('nav.about')}</Link></li>
            </ul>
          </div>

          {/* Seasons */}
          <div>
            <h4 className="font-bold tracking-widest uppercase text-sm mb-6 text-orange-accent">
              {t('footer.seasonsTitle') || 'Seasons'}
            </h4>
            <ul className="space-y-3 text-sm text-cream/70">
              <li><a href="#" className="hover:text-orange-accent transition-colors">🍂 {t('seasons.Autumn')}</a></li>
              <li><a href="#" className="hover:text-orange-accent transition-colors">❄️ {t('seasons.Winter')}</a></li>
              <li><a href="#" className="hover:text-orange-accent transition-colors">🌸 {t('seasons.Spring')}</a></li>
              <li><a href="#" className="hover:text-orange-accent transition-colors">☀️ {t('seasons.Summer')}</a></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cream/40 tracking-wider uppercase">
            © {new Date().getFullYear()} Saveurs Recipes. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-cream/40 tracking-wider uppercase">
            <a href="#" className="hover:text-orange-accent transition-colors">Privacy</a>
            <a href="#" className="hover:text-orange-accent transition-colors">Terms</a>
            <a href="#" className="hover:text-orange-accent transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;