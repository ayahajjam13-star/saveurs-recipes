import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

function About() {
  const { t } = useTranslation();

  const stats = [
    { number: '120', label: t('about.stats.recipes'), icon: '🍽️' },
    { number: '20+', label: t('about.stats.countries'), icon: '🌍' },
    { number: '4', label: t('about.stats.seasons'), icon: '🍂' },
    { number: '100%', label: t('about.stats.free'), icon: '✨' },
  ];

  const features = [
    { icon: '🌍', title: t('about.features.global.title'), description: t('about.features.global.desc') },
    { icon: '🍂', title: t('about.features.seasonal.title'), description: t('about.features.seasonal.desc') },
    { icon: '❤️', title: t('about.features.favorites.title'), description: t('about.features.favorites.desc') },
    { icon: '🔍', title: t('about.features.search.title'), description: t('about.features.search.desc') },
  ];

  return (
    <div className="animate-fade-in bg-cream dark:bg-dark-bg transition-colors">
      
      <SEO 
        title="About"
        description="Discover the story behind Saveurs - recipes by season from around the world."
      />

      <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600&q=80"
            alt="Cooking"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-warm-brown/90 via-warm-brown/70 to-warm-brown/50 dark:from-dark-bg/95 dark:via-dark-bg/80 dark:to-dark-bg/60"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <p className="text-orange-accent font-medium tracking-widest uppercase text-sm mb-4">
            {t('about.hero')}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-cream leading-tight mb-6">
            {t('about.title1')}
            <span className="block text-orange-accent italic">{t('about.title2')}</span>
          </h1>
          <p className="text-lg text-cream/80 max-w-2xl mx-auto leading-relaxed">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg border border-warm-brown/5 dark:border-dark-text/5 text-center transition-colors">
              <p className="text-4xl mb-2">{stat.icon}</p>
              <p className="font-serif text-4xl font-bold text-orange-accent mb-1">{stat.number}</p>
              <p className="text-sm text-warm-brown/60 dark:text-dark-text/60 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-warm-brown dark:text-dark-text mb-6">
            {t('about.why')}
          </h2>
          <p className="text-lg text-warm-brown/70 dark:text-dark-text/70 leading-relaxed">
            {t('about.whyText')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-sm border border-warm-brown/5 dark:border-dark-text/5 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="w-14 h-14 bg-orange-accent/10 rounded-2xl flex items-center justify-center text-3xl mb-5">
                {feature.icon}
              </div>
              <h3 className="font-serif text-2xl font-bold text-warm-brown dark:text-dark-text mb-3">
                {feature.title}
              </h3>
              <p className="text-warm-brown/70 dark:text-dark-text/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-warm-brown to-warm-brown/90 dark:from-dark-card dark:to-dark-card py-20 px-4 transition-colors">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-cream mb-6">
            {t('about.cta.title')}
          </h2>
          <p className="text-cream/70 text-lg mb-10">
            {t('about.cta.subtitle')}
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-orange-accent text-white rounded-2xl font-semibold hover:bg-orange-accent/90 transition-all hover:scale-105 shadow-lg shadow-orange-accent/30"
          >
            🍽️ {t('about.cta.button')}
          </Link>
        </div>
      </section>

    </div>
  );
}

export default About;