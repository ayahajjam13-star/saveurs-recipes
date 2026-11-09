
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
  ChefHat,
  CookingPot,
  Flower2,
  Star,
  MoveUpRight,
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
      number: '01',
      icon: Globe2,
      title: t('about.features.global.title'),
      description: t('about.features.global.desc'),
      bg: 'bg-[#E7F7F8]',
      iconColor: 'text-[#438B98]',
    },
    {
      number: '02',
      icon: Leaf,
      title: t('about.features.seasonal.title'),
      description: t('about.features.seasonal.desc'),
      bg: 'bg-[#EAF6EB]',
      iconColor: 'text-[#629B72]',
    },
    {
      number: '03',
      icon: Heart,
      title: t('about.features.favorites.title'),
      description: t('about.features.favorites.desc'),
      bg: 'bg-[#FCEBF2]',
      iconColor: 'text-[#C77E9E]',
    },
    {
      number: '04',
      icon: Search,
      title: t('about.features.search.title'),
      description: t('about.features.search.desc'),
      bg: 'bg-[#F0EBFC]',
      iconColor: 'text-[#8B78BC]',
    },
  ];

  return (
    <main className="overflow-hidden bg-[#F8FCFC] text-[#24515B]">
      <SEO
        title="About"
        description="Discover the story behind Saveurs - recipes by season from around the world."
      />

      {/* HERO */}
      <section className="relative px-5 pb-20 pt-12 sm:px-8 lg:px-12 lg:pb-28 lg:pt-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">

          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#B8E8EE] bg-white px-4 py-2">
              <Sparkles size={14} className="text-[#63B9C8]" />
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#568D97]">
                {t('about.hero')}
              </span>
            </div>

            <h1 className="max-w-2xl font-serif text-5xl font-medium leading-[1.12] tracking-tight text-[#24515B] sm:text-6xl lg:text-7xl">
              {t('about.title1')}
              <span className="mt-2 block font-serif italic text-[#65B9C8]">
                {t('about.title2')}
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-[#718F95] sm:text-lg">
              {t('about.subtitle')}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                to="/"
                className="group inline-flex items-center gap-3 rounded-full bg-[#24515B] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-[#24515B]/15 transition-all hover:-translate-y-1 hover:bg-[#34717D]"
              >
                Explore recipes
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#77969B]">
                <Heart size={15} className="fill-[#F2C7DB] text-[#D99AB8]" />
                Made with love
              </div>
            </div>

            <div className="mt-12 flex items-center gap-4 border-t border-[#DCEEEF] pt-6">
              <div className="flex -space-x-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#F8FCFC] bg-[#B8E8EE]">
                  <ChefHat size={16} className="text-[#24515B]" />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#F8FCFC] bg-[#F2C7DB]">
                  <Heart size={15} className="text-[#A75D7D]" />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#F8FCFC] bg-[#BFE8C8]">
                  <Leaf size={15} className="text-[#568C68]" />
                </div>
              </div>
              <p className="text-xs leading-5 text-[#829DA1]">
                Good food, beautiful moments
                <span className="block font-bold text-[#527D85]">
                  Welcome to Saveurs
                </span>
              </p>
            </div>
          </div>

          {/* Hero image composition */}
          <div className="relative mx-auto w-full max-w-[600px]">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#B8E8EE]/60 blur-3xl" />
            <div className="absolute -bottom-10 -left-8 h-44 w-44 rounded-full bg-[#F2C7DB]/50 blur-3xl" />

            <div className="relative grid grid-cols-[1.2fr_0.8fr] items-center gap-3 sm:gap-5">
              <div className="relative overflow-hidden rounded-[110px_110px_24px_24px] border-[6px] border-white shadow-2xl shadow-[#24515B]/10">
                <img
                  src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1000&q=85"
                  alt="Fresh ingredients and colorful food"
                  className="h-[390px] w-full object-cover sm:h-[490px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#163F48]/35 to-transparent" />
              </div>

              <div className="flex flex-col gap-4">
                <div className="overflow-hidden rounded-[24px] border-4 border-white shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=700&q=85"
                    alt="Warm and welcoming kitchen"
                    className="h-44 w-full object-cover sm:h-56"
                    loading="lazy"
                  />
                </div>

                <div className="overflow-hidden rounded-[24px] border-4 border-white shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1547592180-85f173990554?w=700&q=85"
                    alt="Fresh healthy meal"
                    className="h-36 w-full object-cover sm:h-44"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 left-2 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl sm:-left-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#BFE8C8]/50 text-[#548D67]">
                <CookingPot size={23} />
              </div>
              <div>
                <p className="font-serif text-lg font-bold text-[#24515B]">
                  Made with love
                </p>
                <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#91A9AC]">
                  Shared with passion
                </p>
              </div>
            </div>

            <div className="absolute -right-3 top-8 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#F2C7DB] text-[#A75D7D] shadow-lg sm:-right-5">
              <Flower2 size={24} />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative border-y border-[#DCEEEF] bg-white px-5 py-10 sm:px-8 lg:py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-9 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={index}
                className={`flex items-center justify-center gap-4 ${
                  index !== 0 ? 'lg:border-l lg:border-[#E4F0F1]' : ''
                }`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF7F8] text-[#5C9DA8]">
                  <Icon size={21} />
                </div>

                <div>
                  <p className="font-serif text-3xl font-bold text-[#24515B] sm:text-4xl">
                    {stat.number}
                  </p>
                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[1.4px] text-[#8AA4A8] sm:text-[10px]">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* OUR STORY */}
      <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2 lg:gap-24">

          <div className="relative">
            <div className="absolute -left-7 -top-7 h-32 w-32 rounded-full border border-[#B8E8EE] sm:-left-10 sm:-top-10" />
            <div className="absolute -bottom-8 -right-5 h-40 w-40 rounded-full bg-[#F2C7DB]/35 blur-2xl" />

            <div className="relative overflow-hidden rounded-[28px] rounded-tr-[120px] border-[7px] border-white shadow-2xl shadow-[#24515B]/10">
              <img
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1000&q=85"
                alt="A beautiful kitchen ready for cooking"
                loading="lazy"
                className="h-[400px] w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-[540px]"
              />
            </div>

            <div className="absolute -bottom-8 left-5 max-w-[230px] rounded-2xl bg-[#24515B] p-5 text-white shadow-xl sm:left-10 sm:p-6">
              <Star size={20} className="mb-3 fill-[#7ADDF2] text-[#7ADDF2]" />
              <p className="font-serif text-2xl italic">
                Every dish tells a story.
              </p>
              <p className="mt-2 text-[9px] font-bold uppercase tracking-[2px] text-[#B8E8EE]">
                The Saveurs philosophy
              </p>
            </div>
          </div>

          <div className="pt-5 lg:pt-0">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-[#7ADDF2]" />
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-[#6CAAB5]">
                Our story
              </span>
            </div>

            <h2 className="max-w-xl font-serif text-4xl font-medium leading-tight text-[#24515B] sm:text-5xl lg:text-6xl">
              {t('about.why')}
            </h2>

            <div className="my-7 h-1 w-20 rounded-full bg-gradient-to-r from-[#7ADDF2] to-[#BFE8C8]" />

            <p className="text-base leading-9 text-[#718F95] sm:text-lg">
              {t('about.whyText')}
            </p>

            <div className="mt-9 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FCEBF2] text-[#C77E9E]">
                <Heart size={21} />
              </div>
              <div>
                <p className="font-serif text-lg font-bold text-[#24515B]">
                  Saveurs Recipes
                </p>
                <p className="text-xs text-[#91A9AC]">
                  Food, culture and inspiration
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative overflow-hidden bg-[#EDF8F9] px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#B8E8EE]/50 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#F2C7DB]/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-10 bg-[#7ADDF2]" />
                <span className="text-[10px] font-bold uppercase tracking-[3px] text-[#6CAAB5]">
                  What makes us special
                </span>
              </div>

              <h2 className="font-serif text-4xl font-medium leading-tight text-[#24515B] sm:text-5xl lg:text-6xl">
                Discover our
                <span className="block italic text-[#68B6C3]">
                  little world.
                </span>
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-[#78969B]">
              Explore everything that makes your culinary experience special,
              inspiring and delicious.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.number}
                  className="group relative overflow-hidden rounded-[26px] border border-white bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#24515B]/8 sm:p-8"
                >
                  <div className="mb-9 flex items-center justify-between">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bg} ${feature.iconColor} transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`}>
                      <Icon size={25} />
                    </div>

                    <span className="font-serif text-3xl text-[#DCEEEF]">
                      {feature.number}
                    </span>
                  </div>

                  <h3 className="mb-4 font-serif text-2xl font-bold text-[#24515B] transition-colors group-hover:text-[#5BABB9]">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-7 text-[#819A9E]">
                    {feature.description}
                  </p>

                  <div className="mt-8 flex items-center justify-between">
                    <span className="h-[3px] w-10 rounded-full bg-[#B8E8EE] transition-all duration-500 group-hover:w-20 group-hover:bg-[#7ADDF2]" />
                    <MoveUpRight
                      size={18}
                      className="text-[#A5C6CA] transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#5BABB9]"
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#24515B] px-5 py-24 sm:px-8 lg:py-32">
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute -right-12 -top-20 h-72 w-72 rounded-full border border-white/10" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-[#7ADDF2]/10 blur-3xl" />
        <div className="absolute left-[12%] top-14 rotate-12 text-[#B8E8EE]/15">
          <Utensils size={75} />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/15 bg-white/10 text-[#F2C7DB]">
            <Heart size={29} />
          </div>

          <p className="mb-6 text-[10px] font-bold uppercase tracking-[3px] text-[#7ADDF2]">
            A world of flavors
          </p>

          <h2 className="font-serif text-4xl font-medium leading-tight text-white sm:text-5xl lg:text-6xl">
            {t('about.cta.title')}
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-white/65 sm:text-base">
            {t('about.cta.subtitle')}
          </p>

          <Link
            to="/"
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-[#B8E8EE] px-8 py-4 text-sm font-bold text-[#24515B] shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:bg-white"
          >
            <Utensils size={18} />
            {t('about.cta.button')}
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          <div className="mt-12 flex items-center justify-center gap-3 text-[10px] font-medium tracking-[2px] text-white/40">
            <span className="h-px w-8 bg-white/20" />
            GOOD FOOD, GOOD MOOD
            <span className="h-px w-8 bg-white/20" />
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
