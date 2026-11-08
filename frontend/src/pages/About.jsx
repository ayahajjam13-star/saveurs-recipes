
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Globe2,
  Leaf,
  Heart,
  Search,
  ArrowRight,
  Sparkles,
  Utensils,
  ChefHat
} from 'lucide-react';
import SEO from '../components/SEO';

function About() {
  const { t } = useTranslation();

  const stats = [
    { number: '120', label: t('about.stats.recipes'), icon: Utensils },
    { number: '20+', label: t('about.stats.countries'), icon: Globe2 },
    { number: '4', label: t('about.stats.seasons'), icon: Leaf },
    { number: '100%', label: t('about.stats.free'), icon: Heart },
  ];

  const features = [
    {
      icon: Globe2,
      title: t('about.features.global.title'),
      description: t('about.features.global.desc'),
      color: 'bg-[#C6D97A]/30',
      iconColor: 'text-[#87A93D]',
    },
    {
      icon: Leaf,
      title: t('about.features.seasonal.title'),
      description: t('about.features.seasonal.desc'),
      color: 'bg-[#F9E3C7]',
      iconColor: 'text-[#87A93D]',
    },
    {
      icon: Heart,
      title: t('about.features.favorites.title'),
      description: t('about.features.favorites.desc'),
      color: 'bg-[#F7A1B3]/30',
      iconColor: 'text-[#F16D7A]',
    },
    {
      icon: Search,
      title: t('about.features.search.title'),
      description: t('about.features.search.desc'),
      color: 'bg-[#F16D7A]/10',
      iconColor: 'text-[#F16D7A]',
    },
  ];

  return (
    <main className="bg-[#FDF8F0] text-[#394323] overflow-hidden animate-fade-in">

      <SEO
        title="About"
        description="Discover the story behind Saveurs - recipes by season from around the world."
      />

      {/* HERO SECTION */}
      <section className="relative min-h-[570px] md:min-h-[650px] flex items-center justify-center overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1800&q=85"
          alt="Fresh ingredients and delicious food"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#394323]/85 via-[#394323]/65 to-[#394323]/35" />

        <div className="absolute top-16 right-10 w-48 h-48 rounded-full bg-[#F7A1B3]/20 blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-24">

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white text-xs tracking-[0.25em] uppercase mb-8">
            <Sparkles size={14} />
            {t('about.hero')}
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-normal text-white leading-tight mb-7">
            {t('about.title1')}
            <span className="block text-[#F7A1B3] italic mt-2">
              {t('about.title2')}
            </span>
          </h1>

          <p className="text-white/85 text-base md:text-xl max-w-2xl mx-auto leading-8 font-light">
            {t('about.subtitle')}
          </p>

          <div className="flex justify-center mt-10">
            <span className="w-16 h-[2px] bg-[#C6D97A]" />
            <span className="w-3 h-3 rounded-full bg-[#F16D7A] -mt-[5px] mx-3" />
            <span className="w-16 h-[2px] bg-[#C6D97A]" />
          </div>

        </div>

      </section>

      {/* STATS SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 -mt-12">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={index}
                className="group bg-white rounded-[25px] p-6 md:p-8 text-center shadow-lg shadow-[#53652C]/5 border border-[#C6D97A]/20 hover:-translate-y-2 hover:shadow-xl transition-all duration-500"
              >

                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F9E3C7]/60 flex items-center justify-center mb-5 group-hover:bg-[#F7A1B3]/30 transition-colors">
                  <Icon size={26} className="text-[#87A93D]" />
                </div>

                <p className="font-serif text-4xl md:text-5xl text-[#87A93D] mb-3">
                  {stat.number}
                </p>

                <p className="text-[#88816F] text-[10px] md:text-xs uppercase tracking-[0.16em] font-medium">
                  {stat.label}
                </p>

              </div>
            );
          })}

        </div>

      </section>

      {/* OUR STORY SECTION */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24 md:py-32">

        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          <div className="relative">

            <div className="absolute -top-5 -left-5 w-28 h-28 rounded-full bg-[#C6D97A]/30 blur-2xl" />

            <div className="relative rounded-[35px] overflow-hidden shadow-2xl shadow-[#53652C]/10">

              <img
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1000&q=85"
                alt="Beautiful kitchen and cooking"
                loading="lazy"
                className="w-full h-[380px] md:h-[530px] object-cover hover:scale-105 transition-transform duration-700"
              />

            </div>

            <div className="absolute -bottom-7 -right-3 md:-right-8 bg-[#87A93D] text-white rounded-3xl p-6 md:p-8 shadow-xl max-w-[210px]">
              <ChefHat size={32} className="mb-3 text-[#F9E3C7]" />
              <p className="font-serif text-2xl italic">
                Made with love
              </p>
              <p className="text-white/75 text-xs mt-2 tracking-wider">
                SHARED WITH PASSION
              </p>
            </div>

          </div>

          <div className="pt-8 lg:pt-0">

            <p className="text-[#F16D7A] uppercase tracking-[0.3em] text-xs font-semibold mb-5">
              Our Story
            </p>

            <h2 className="font-serif text-4xl md:text-6xl text-[#53652C] leading-tight mb-8">
              {t('about.why')}
            </h2>

            <p className="text-[#88816F] text-base md:text-lg leading-9">
              {t('about.whyText')}
            </p>

            <div className="flex items-center gap-3 mt-9">
              <span className="w-12 h-[2px] bg-[#87A93D]" />
              <Heart size={18} className="text-[#F16D7A]" />
              <span className="text-[#87A93D] uppercase tracking-widest text-xs">
                Saveurs Recipes
              </span>
            </div>

          </div>

        </div>

      </section>

      {/* FEATURES SECTION */}
      <section className="bg-[#F9E3C7]/35 py-24 md:py-28 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="text-center max-w-2xl mx-auto mb-16">

            <p className="text-[#F16D7A] uppercase tracking-[0.3em] text-xs font-semibold mb-5">
              What Makes Us Special
            </p>

            <h2 className="font-serif text-4xl md:text-6xl text-[#53652C] mb-6">
              Discover Our World
            </h2>

            <p className="text-[#88816F] leading-8">
              Explore everything that makes your culinary
              experience special, inspiring and delicious.
            </p>

            <div className="flex justify-center mt-7">
              <span className="w-12 h-px bg-[#C6D97A]" />
              <Heart size={16} className="text-[#F16D7A] mx-3" />
              <span className="w-12 h-px bg-[#C6D97A]" />
            </div>

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className="group bg-white rounded-[28px] p-8 border border-[#C6D97A]/20 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
                >

                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-7 group-hover:rotate-6 transition-transform duration-300`}>
                    <Icon size={29} className={feature.iconColor} />
                  </div>

                  <h3 className="font-serif text-2xl text-[#53652C] mb-4 group-hover:text-[#F16D7A] transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-[#88816F] leading-7 text-sm">
                    {feature.description}
                  </p>

                  <div className="w-10 h-[2px] bg-[#C6D97A] mt-7 group-hover:w-16 group-hover:bg-[#F16D7A] transition-all duration-500" />

                </div>
              );
            })}

          </div>

        </div>

      </section>

      {/* CTA SECTION */}
      <section className="relative overflow-hidden py-24 md:py-32 px-6 bg-[#53652C]">

        <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full border border-white/10" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full border border-white/10" />

        <div className="absolute top-16 right-[15%] text-[#C6D97A]/20">
          <Utensils size={75} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">

          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Heart size={30} className="text-[#F7A1B3]" />
          </div>

          <p className="text-[#C6D97A] uppercase tracking-[0.3em] text-xs font-semibold mb-6">
            A World of Flavors
          </p>

          <h2 className="font-serif text-4xl md:text-6xl text-white leading-tight mb-7">
            {t('about.cta.title')}
          </h2>

          <p className="text-white/70 text-base md:text-lg leading-8 mb-10 max-w-xl mx-auto">
            {t('about.cta.subtitle')}
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-3 px-9 py-4 bg-[#F16D7A] text-white rounded-full font-semibold hover:bg-[#E45C69] hover:scale-105 transition-all duration-300 shadow-xl shadow-black/10"
          >
            <Utensils size={19} />
            {t('about.cta.button')}
            <ArrowRight size={19} />
          </Link>

        </div>

      </section>

    </main>
  );
}

export default About;
