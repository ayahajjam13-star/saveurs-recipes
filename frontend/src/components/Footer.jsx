
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
  Sparkles,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Footer() {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const seasons = [
    { name: 'Autumn', icon: Leaf },
    { name: 'Winter', icon: Snowflake },
    { name: 'Spring', icon: Leaf },
    { name: 'Summer', icon: Sun },
  ];

  const socialLinks = [
    { label: 'Instagram', text: 'IG' },
    { label: 'Facebook', text: 'FB' },
    { label: 'YouTube', text: 'YT' },
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
        error.response?.data?.message ||
        'Something went wrong. Please try again.'
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
    <footer className="relative mt-0 overflow-hidden bg-[#FCFBFA] text-[#54352A] dark:bg-[#2D1E19] dark:text-white">

      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-32 top-40 h-80 w-80 rounded-full bg-[#EDC7B9]/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-[#E6D6C6]/30 blur-3xl" />

      <div className="relative mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-12">

        {/* NEWSLETTER */}
        <div className="relative mt-8 mb-12 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#EDC7B9] via-[#F9EBE6] to-[#F4EDE6] p-7 shadow-xl shadow-[#EB9D81]/10 sm:p-10 lg:p-14">

          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/40 blur-3xl" />
          <div className="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-[#ECE0CD]/40 blur-3xl" />

          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-2">

            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[#864F3B]">
                <Sparkles size={15} />
                Stay inspired
              </div>

              <h2 className="font-serif text-3xl font-extrabold leading-tight text-[#54352A] sm:text-4xl lg:text-5xl">
                A little taste of
                <span className="block text-[#C27F66]">inspiration.</span>
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-[#795D53] sm:text-base">
                {t(
                  'footer.newsletterDesc',
                  'Get seasonal recipes, cooking inspiration and delicious ideas delivered to your inbox.'
                )}
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full">
              <div className="rounded-[1.5rem] border border-white/80 bg-white/70 p-2 shadow-lg shadow-[#C27F66]/10 backdrop-blur-md">

                <div className="flex flex-col gap-2 sm:flex-row">

                  <div className="flex min-w-0 flex-1 items-center gap-3 px-4">
                    <Mail size={20} className="shrink-0 text-[#C27F66]" />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('footer.emailPlaceholder', 'Your email address')}
                      required
                      className="w-full min-w-0 bg-transparent py-4 text-sm text-[#54352A] outline-none placeholder:text-[#A9938B]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || subscribed}
                    className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#EB9D81] px-7 py-4 text-sm font-extrabold text-[#5A3325] shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E58765] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {subscribed ? (
                      <>
                        <CheckCircle2 size={18} />
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
              </div>

              <p className="mt-3 px-3 text-xs text-[#8B6F65]">
                Delicious inspiration, straight to your inbox.
              </p>
            </form>

          </div>
        </div>

        {/* MAIN FOOTER */}
        <div className="grid gap-10 pb-12 pt-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] lg:gap-10">

          {/* BRAND CARD */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-[#EDC7B9] bg-white p-6 shadow-lg shadow-[#EDC7B9]/15 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#432E27]">

            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#EDC7B9]/40 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-[#ECE0CD]/40 blur-3xl" />

            <div className="relative z-10">

              {/* Logo */}
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EB9D81] to-[#EDC7B9] text-[#5A3325] shadow-md transition-transform duration-300 group-hover:rotate-6">
                  <ChefHat size={27} />
                </div>

                <div>
                  <span className="block font-serif text-2xl font-extrabold tracking-wide text-[#54352A] dark:text-white">
                    Saveurs<span className="text-[#D97A57]">.</span>
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#A98E84]">
                    Cook · Explore · Enjoy
                  </span>
                </div>
              </Link>

              {/* Food image */}
              <div className="relative mt-7 h-40 overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=700&q=85"
                  alt="Fresh and colorful food"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#3F2921]/70 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4">
                  <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#864F3B]">
                    Made with love
                  </span>
                </div>
              </div>

              {/* Brand message */}
              <div className="mt-6">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C98972]">
                  A world of flavors
                </span>

                <h3 className="mt-2 font-serif text-3xl font-extrabold leading-tight text-[#54352A] dark:text-white">
                  Good food,
                  <span className="block text-[#D97A57]">good mood.</span>
                </h3>

                <p className="mt-3 max-w-xs text-sm leading-7 text-[#968179] dark:text-gray-300">
                  Bringing people together, one delicious recipe at a time.
                </p>
              </div>

              {/* Food emojis */}
              <div className="my-5 flex items-center gap-3 border-y border-[#F3E9E5] py-4 text-2xl dark:border-white/10">
                <span>🍓</span>
                <span>🥑</span>
                <span>🧁</span>
                <span>🍋</span>
                <span>🥐</span>
                <span>🍒</span>
              </div>

              {/* Social links */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#968179] dark:text-[#EDC7B9]">
                  <Heart size={15} fill="currentColor" className="text-[#DDC7A6]" />
                  Made for food lovers
                </div>

                <div className="flex items-center gap-2">
                  {socialLinks.map(({ label, text }) => (
                    <a
                      key={label}
                      href="#"
                      aria-label={label}
                      onClick={(e) => e.preventDefault()}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FAEEEA] text-[10px] font-extrabold text-[#864F3B] transition-all duration-300 hover:-translate-y-1 hover:bg-[#EB9D81] hover:text-[#5A3325] dark:bg-white/10 dark:text-[#EDC7B9]"
                    >
                      {text}
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* EXPLORE */}
          <div className="pt-4">
            <h3 className="mb-6 font-serif text-lg font-extrabold text-[#54352A] dark:text-white">
              {t('footer.explore', 'Explore')}
            </h3>

            <ul className="space-y-4">
              {exploreLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group inline-flex items-center gap-2 text-sm text-[#907A72] transition-all duration-300 hover:translate-x-1 hover:text-[#CE6E4B] dark:text-gray-300"
                  >
                    <ArrowUpRight
                      size={15}
                      className="text-[#EB9D81] transition-transform group-hover:translate-x-1"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SEASONS */}
          <div className="pt-4">
            <h3 className="mb-6 font-serif text-lg font-extrabold text-[#54352A] dark:text-white">
              {t('footer.seasons', 'By Season')}
            </h3>

            <ul className="space-y-4">
              {seasons.map((season) => {
                const SeasonIcon = season.icon;

                return (
                  <li key={season.name}>
                    <Link
                      to={`/search?season=${season.name.toLowerCase()}`}
                      className="group inline-flex items-center gap-3 text-sm text-[#907A72] transition-all duration-300 hover:translate-x-1 hover:text-[#CE6E4B] dark:text-gray-300"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FAEEEA] text-[#C97658] transition-colors group-hover:bg-[#EDC7B9] dark:bg-white/10">
                        <SeasonIcon size={17} />
                      </span>

                      {season.name}

                      <ArrowUpRight
                        size={13}
                        className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* MADE WITH LOVE */}
          <div className="pt-4">
            <h3 className="mb-6 font-serif text-lg font-extrabold text-[#54352A] dark:text-white">
              {t('footer.contact', 'Made with love')}
            </h3>

            <p className="text-sm leading-7 text-[#907A72] dark:text-gray-300">
              {t(
                'footer.contactDesc',
                'Good food brings people together. Explore, cook and share beautiful moments.'
              )}
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#ECE0CD] bg-[#FDFAF5] px-4 py-3 text-xs font-bold text-[#AB977A] dark:border-white/10 dark:bg-white/5 dark:text-[#ECE0CD]">
              <Heart size={16} fill="currentColor" />
              Made for food lovers
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#A98E84]">
              <Sparkles size={14} className="text-[#E6D6C6]" />
              Cook. Explore. Enjoy.
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col items-center justify-between gap-5 border-t border-[#EFE2DD] py-7 text-center sm:flex-row sm:text-left dark:border-white/10">

          <p className="text-xs text-[#A4928B] dark:text-gray-400">
            © {new Date().getFullYear()} Saveurs.{' '}
            {t('footer.rights', 'All rights reserved.')}
          </p>

          <p className="flex items-center gap-1 text-xs text-[#A4928B] dark:text-gray-400">
            {t('footer.madeWith', 'Made with')}
            <Heart size={13} className="mx-1 text-[#DDC7A6]" fill="currentColor" />
            {t('footer.forFoodies', 'for food lovers')}
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EB9D81] text-[#5A3325] shadow-md shadow-[#EB9D81]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#E58765] hover:shadow-lg"
          >
            <ArrowUp size={19} />
          </button>

        </div>

      </div>
    </footer>
  );
}

export default Footer;
