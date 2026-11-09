
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
    <footer className="relative mt-0 overflow-hidden bg-[#FAFCFC] text-[#294B55] dark:bg-[#18262E] dark:text-white">

      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-32 top-40 h-80 w-80 rounded-full bg-[#B8E8EE]/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-[#CBB7F5]/30 blur-3xl" />

      <div className="relative mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-12">

        {/* NEWSLETTER */}
        <div className="relative mt-8 mb-12 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#B8E8EE] via-[#E5F5FA] to-[#E9DFFB] p-7 shadow-xl shadow-[#7ADDF2]/10 sm:p-10 lg:p-14">

          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/40 blur-3xl" />
          <div className="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-[#F2C7DB]/40 blur-3xl" />

          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-2">

            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[#397D88]">
                <Sparkles size={15} />
                Stay inspired
              </div>

              <h2 className="font-serif text-3xl font-extrabold leading-tight text-[#294B55] sm:text-4xl lg:text-5xl">
                A little taste of
                <span className="block text-[#648CC4]">inspiration.</span>
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-[#52727A] sm:text-base">
                {t(
                  'footer.newsletterDesc',
                  'Get seasonal recipes, cooking inspiration and delicious ideas delivered to your inbox.'
                )}
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full">
              <div className="rounded-[1.5rem] border border-white/80 bg-white/70 p-2 shadow-lg shadow-[#648CC4]/10 backdrop-blur-md">

                <div className="flex flex-col gap-2 sm:flex-row">

                  <div className="flex min-w-0 flex-1 items-center gap-3 px-4">
                    <Mail size={20} className="shrink-0 text-[#648CC4]" />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('footer.emailPlaceholder', 'Your email address')}
                      required
                      className="w-full min-w-0 bg-transparent py-4 text-sm text-[#294B55] outline-none placeholder:text-[#8AA5AA]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || subscribed}
                    className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#7ADDF2] px-7 py-4 text-sm font-extrabold text-[#24515B] shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#62CFE8] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
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

              <p className="mt-3 px-3 text-xs text-[#64858C]">
                Delicious inspiration, straight to your inbox.
              </p>
            </form>

          </div>
        </div>

        {/* MAIN FOOTER */}
        <div className="grid gap-10 pb-12 pt-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] lg:gap-10">

          {/* BRAND CARD */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-[#B8E8EE] bg-white p-6 shadow-lg shadow-[#B8E8EE]/15 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#263C44]">

            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#B8E8EE]/40 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-[#F2C7DB]/40 blur-3xl" />

            <div className="relative z-10">

              {/* Logo */}
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7ADDF2] to-[#B8E8EE] text-[#24515B] shadow-md transition-transform duration-300 group-hover:rotate-6">
                  <ChefHat size={27} />
                </div>

                <div>
                  <span className="block font-serif text-2xl font-extrabold tracking-wide text-[#294B55] dark:text-white">
                    Saveurs<span className="text-[#54C5DC]">.</span>
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#83A5AA]">
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

                <div className="absolute inset-0 bg-gradient-to-t from-[#203B40]/70 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4">
                  <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#397D88]">
                    Made with love
                  </span>
                </div>
              </div>

              {/* Brand message */}
              <div className="mt-6">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#70BFCB]">
                  A world of flavors
                </span>

                <h3 className="mt-2 font-serif text-3xl font-extrabold leading-tight text-[#294B55] dark:text-white">
                  Good food,
                  <span className="block text-[#54C5DC]">good mood.</span>
                </h3>

                <p className="mt-3 max-w-xs text-sm leading-7 text-[#789197] dark:text-gray-300">
                  Bringing people together, one delicious recipe at a time.
                </p>
              </div>

              {/* Food emojis */}
              <div className="my-5 flex items-center gap-3 border-y border-[#E5F2F3] py-4 text-2xl dark:border-white/10">
                <span>🍓</span>
                <span>🥑</span>
                <span>🧁</span>
                <span>🍋</span>
                <span>🥐</span>
                <span>🍒</span>
              </div>

              {/* Social links */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#789197] dark:text-[#B8E8EE]">
                  <Heart size={15} fill="currentColor" className="text-[#E99AB8]" />
                  Made for food lovers
                </div>

                <div className="flex items-center gap-2">
                  {socialLinks.map(({ label, text }) => (
                    <a
                      key={label}
                      href="#"
                      aria-label={label}
                      onClick={(e) => e.preventDefault()}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF9FA] text-[10px] font-extrabold text-[#397D88] transition-all duration-300 hover:-translate-y-1 hover:bg-[#7ADDF2] hover:text-[#24515B] dark:bg-white/10 dark:text-[#B8E8EE]"
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
            <h3 className="mb-6 font-serif text-lg font-extrabold text-[#294B55] dark:text-white">
              {t('footer.explore', 'Explore')}
            </h3>

            <ul className="space-y-4">
              {exploreLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group inline-flex items-center gap-2 text-sm text-[#718B91] transition-all duration-300 hover:translate-x-1 hover:text-[#48BBD1] dark:text-gray-300"
                  >
                    <ArrowUpRight
                      size={15}
                      className="text-[#7ADDF2] transition-transform group-hover:translate-x-1"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SEASONS */}
          <div className="pt-4">
            <h3 className="mb-6 font-serif text-lg font-extrabold text-[#294B55] dark:text-white">
              {t('footer.seasons', 'By Season')}
            </h3>

            <ul className="space-y-4">
              {seasons.map((season) => {
                const SeasonIcon = season.icon;

                return (
                  <li key={season.name}>
                    <Link
                      to={`/search?season=${season.name.toLowerCase()}`}
                      className="group inline-flex items-center gap-3 text-sm text-[#718B91] transition-all duration-300 hover:translate-x-1 hover:text-[#48BBD1] dark:text-gray-300"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF9FA] text-[#55BCCC] transition-colors group-hover:bg-[#B8E8EE] dark:bg-white/10">
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
            <h3 className="mb-6 font-serif text-lg font-extrabold text-[#294B55] dark:text-white">
              {t('footer.contact', 'Made with love')}
            </h3>

            <p className="text-sm leading-7 text-[#718B91] dark:text-gray-300">
              {t(
                'footer.contactDesc',
                'Good food brings people together. Explore, cook and share beautiful moments.'
              )}
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#F2C7DB] bg-[#FFF3F8] px-4 py-3 text-xs font-bold text-[#B66F91] dark:border-white/10 dark:bg-white/5 dark:text-[#F2C7DB]">
              <Heart size={16} fill="currentColor" />
              Made for food lovers
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#83A5AA]">
              <Sparkles size={14} className="text-[#CBB7F5]" />
              Cook. Explore. Enjoy.
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col items-center justify-between gap-5 border-t border-[#DDEDEF] py-7 text-center sm:flex-row sm:text-left dark:border-white/10">

          <p className="text-xs text-[#8AA1A5] dark:text-gray-400">
            © {new Date().getFullYear()} Saveurs.{' '}
            {t('footer.rights', 'All rights reserved.')}
          </p>

          <p className="flex items-center gap-1 text-xs text-[#8AA1A5] dark:text-gray-400">
            {t('footer.madeWith', 'Made with')}
            <Heart size={13} className="mx-1 text-[#E99AB8]" fill="currentColor" />
            {t('footer.forFoodies', 'for food lovers')}
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7ADDF2] text-[#24515B] shadow-md shadow-[#7ADDF2]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#62CFE8] hover:shadow-lg"
          >
            <ArrowUp size={19} />
          </button>

        </div>

      </div>
    </footer>
  );
}

export default Footer;
