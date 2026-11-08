
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import {
  ChefHat,
  Send,
  ArrowUpRight,
  Heart,
  CheckCircle2,
  Leaf,
  Snowflake,
  Sun,
  Mail,
  ArrowUp,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Footer() {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const seasons = [
    {
      name: 'Autumn',
      icon: Leaf,
      color: '#D99A68',
    },
    {
      name: 'Winter',
      icon: Snowflake,
      color: '#91B8D4',
    },
    {
      name: 'Spring',
      icon: Leaf,
      color: '#A8B995',
    },
    {
      name: 'Summer',
      icon: Sun,
      color: '#E8B96C',
    },
  ];

  const socialLinks = [
    { label: 'Instagram', text: 'IG', url: null },
    { label: 'Facebook', text: 'FB', url: null },
    { label: 'YouTube', text: 'YT', url: null },
  ];

  const exploreLinks = [
    { label: t('nav.home', 'Home'), path: '/' },
    { label: t('nav.search', 'Explore Recipes'), path: '/search' },
    { label: t('nav.favorites', 'Favorites'), path: '/favorites' },
    { label: t('nav.about', 'About Us'), path: '/about' },
  ];

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API_URL}/newsletter/subscribe`, {
        email: email.trim(),
      });

      setSubscribed(true);
      setEmail('');
      toast.success('Successfully subscribed!');

      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="relative mt-20 overflow-hidden bg-[#28221E] text-[#FAF7F0]">

      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#E88FA5]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#A8B995]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Newsletter */}
        <div className="border-b border-white/10 py-14">
          <div className="grid items-center gap-8 md:grid-cols-2">

            <div>
              <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-[#E88FA5]">
                Stay inspired
              </span>

              <h2 className="font-serif text-3xl font-bold leading-tight md:text-4xl">
                {t('footer.newsletterTitle', 'A little taste of inspiration')}
              </h2>

              <p className="mt-3 max-w-md text-sm leading-7 text-[#C7BDB4]">
                {t(
                  'footer.newsletterDesc',
                  'Get seasonal recipes, cooking inspiration and delicious ideas delivered to your inbox.'
                )}
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full">
              <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-md sm:flex-row">

                <div className="flex flex-1 items-center gap-3 px-3">
                  <Mail size={19} className="shrink-0 text-[#E88FA5]" />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('footer.emailPlaceholder', 'Your email address')}
                    required
                    className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-[#A99D93]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || subscribed}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#E88FA5] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#D97991] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {subscribed ? (
                    <>
                      <CheckCircle2 size={17} />
                      Subscribed
                    </>
                  ) : loading ? (
                    'Sending...'
                  ) : (
                    <>
                      Subscribe
                      <Send size={16} />
                    </>
                  )}
                </button>

              </div>
            </form>

          </div>
        </div>

        {/* Main footer */}
        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link to="/" className="mb-5 inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E88FA5] text-white shadow-lg shadow-[#E88FA5]/20">
                <ChefHat size={27} />
              </div>

              <span className="font-serif text-3xl font-bold tracking-wide">
                Saveurs<span className="text-[#E88FA5]">.</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-[#C7BDB4]">
              {t(
                'footer.description',
                'Discover the joy of cooking with beautiful seasonal recipes made with love.'
              )}
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ label, text }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  onClick={(e) => e.preventDefault()}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-[#FAF7F0] transition-all duration-300 hover:border-[#E88FA5] hover:bg-[#E88FA5] hover:text-white"
                >
                  {text}
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-6 font-serif text-xl font-bold text-white">
              {t('footer.explore', 'Explore')}
            </h3>

            <ul className="space-y-4">
              {exploreLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group flex items-center gap-2 text-sm text-[#C7BDB4] transition-colors hover:text-[#E88FA5]"
                  >
                    <ArrowUpRight
                      size={15}
                      className="text-[#E88FA5] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Seasons */}
          <div>
            <h3 className="mb-6 font-serif text-xl font-bold text-white">
              {t('footer.seasons', 'By Season')}
            </h3>

            <ul className="space-y-4">
              {seasons.map((season) => {
                const SeasonIcon = season.icon;

                return (
                  <li key={season.name}>
                    <Link
                      to={`/search?season=${season.name.toLowerCase()}`}
                      className="group flex items-center gap-3 text-sm text-[#C7BDB4] transition-colors hover:text-white"
                    >
                      <SeasonIcon
                        size={18}
                        style={{ color: season.color }}
                      />

                      <span>{season.name}</span>

                      <ArrowUpRight
                        size={14}
                        className="ml-auto opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 font-serif text-xl font-bold text-white">
              {t('footer.contact', 'Made with love')}
            </h3>

            <p className="text-sm leading-7 text-[#C7BDB4]">
              {t(
                'footer.contactDesc',
                'Good food brings people together. Explore, cook and share beautiful moments.'
              )}
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm text-[#E88FA5]">
              <Heart size={17} fill="currentColor" />
              Made for food lovers
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 text-center sm:flex-row sm:text-left">

          <p className="text-xs text-[#A99D93]">
            © {new Date().getFullYear()} Saveurs.{' '}
            {t('footer.rights', 'All rights reserved.')}
          </p>

          <p className="flex items-center gap-1 text-xs text-[#A99D93]">
            {t('footer.madeWith', 'Made with')}
            <Heart size={13} className="mx-1 text-[#E88FA5]" fill="currentColor" />
            {t('footer.forFoodies', 'for food lovers')}
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#E88FA5] transition-all duration-300 hover:-translate-y-1 hover:bg-[#E88FA5] hover:text-white"
          >
            <ArrowUp size={18} />
          </button>

        </div>

      </div>
    </footer>
  );
}

export default Footer;
