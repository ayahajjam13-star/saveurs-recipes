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
    <footer className="bg-warm-brown dark:bg-dark-card text-cream mt-20 transition-colors">
      
      <div className="border-b border-cream/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-serif text-3xl font-bold mb-2">📬 {t('footer.newsletter')}</h3>
              <p className="text-cream/70">{t('footer.newsletterText')}</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.emailPlaceholder')}
                required
                disabled={loading || subscribed}
                className="flex-1 px-5 py-4 rounded-2xl bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/40 focus:outline-none focus:border-orange-accent transition-colors disabled:opacity-50"
              />
              <button 
                type="submit" 
                disabled={loading || subscribed}
                className="px-6 py-4 bg-orange-accent text-white rounded-2xl font-medium hover:bg-orange-accent/90 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {loading ? '⏳' : subscribed ? '✓ Done' : t('footer.subscribe')}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-accent rounded-full flex items-center justify-center text-white text-2xl">🍽️</div>
              <div>
                <h3 className="font-serif text-3xl font-bold leading-none">Saveurs</h3>
                <p className="text-xs text-cream/50 tracking-widest uppercase mt-1">Recipes by Season</p>
              </div>
            </div>
            <p className="text-cream/70 leading-relaxed mb-6 max-w-md">
              {t('footer.description')}
            </p>
            
            <div className="flex gap-3">
              <a href="#" className="w-11 h-11 rounded-full bg-cream/10 hover:bg-orange-accent flex items-center justify-center transition-colors text-lg">📷</a>
              <a href="#" className="w-11 h-11 rounded-full bg-cream/10 hover:bg-orange-accent flex items-center justify-center transition-colors text-lg">🐦</a>
              <a href="#" className="w-11 h-11 rounded-full bg-cream/10 hover:bg-orange-accent flex items-center justify-center transition-colors text-lg">📘</a>
              <a href="#" className="w-11 h-11 rounded-full bg-cream/10 hover:bg-orange-accent flex items-center justify-center transition-colors text-lg">📌</a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold mb-6">{t('footer.explore')}</h4>
            <ul className="space-y-3 text-cream/70">
              <li><Link to="/" className="hover:text-orange-accent transition-colors flex items-center gap-2"><span className="text-orange-accent">→</span> {t('nav.home')}</Link></li>
              <li><Link to="/search" className="hover:text-orange-accent transition-colors flex items-center gap-2"><span className="text-orange-accent">→</span> {t('nav.search')}</Link></li>
              <li><Link to="/favorites" className="hover:text-orange-accent transition-colors flex items-center gap-2"><span className="text-orange-accent">→</span> {t('nav.favorites')}</Link></li>
              <li><Link to="/about" className="hover:text-orange-accent transition-colors flex items-center gap-2"><span className="text-orange-accent">→</span> {t('nav.about')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold mb-6">{t('footer.seasonsTitle')}</h4>
            <ul className="space-y-3 text-cream/70">
              <li><a href="#" className="hover:text-orange-accent transition-colors">🍂 {t('seasons.Autumn')}</a></li>
              <li><a href="#" className="hover:text-orange-accent transition-colors">❄️ {t('seasons.Winter')}</a></li>
              <li><a href="#" className="hover:text-orange-accent transition-colors">🌸 {t('seasons.Spring')}</a></li>
              <li><a href="#" className="hover:text-orange-accent transition-colors">☀️ {t('seasons.Summer')}</a></li>
            </ul>
          </div>

        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/50 text-sm">{t('footer.copyright')}</p>
          <div className="flex gap-6 text-sm text-cream/50">
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