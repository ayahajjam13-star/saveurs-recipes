import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

import { getRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import SEO from '../components/SEO';

const imageUrl = (img) =>
  !img ? null : img.startsWith('http') ? img : `/images/${img}`;

function Cuisines() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const selected = params.get('c') || '';

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getRecipes()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        if (!cancelled) setRecipes(data);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const cuisines = useMemo(() => {
    const map = new Map();
    recipes.forEach((r) => {
      if (!r.cuisine) return;
      const item = map.get(r.cuisine) || { name: r.cuisine, count: 0, image: null };
      item.count += 1;
      if (!item.image && r.image) item.image = imageUrl(r.image);
      map.set(r.cuisine, item);
    });
    return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [recipes]);

  const filtered = useMemo(
    () => (selected ? recipes.filter((r) => r.cuisine === selected) : []),
    [recipes, selected]
  );

  const select = (name) => {
    if (name) setParams({ c: name });
    else setParams({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#FAF6EF] px-4 py-14 dark:bg-[#1C1410] sm:px-8">
      <SEO
        title={t('cuisines.title', 'Explore World Cuisines')}
        description={t('cuisines.subtitle', 'Discover signature dishes from every corner of the world.')}
      />

      <div className="mx-auto max-w-7xl">
        <header className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C8582A]/15 text-[#A8441F] dark:text-[#E08A5F]">
            <Globe size={28} />
          </div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#C8582A]">
            {t('cuisines.eyebrow', 'Discover the world through food')}
          </p>
          <h1 className="font-serif text-4xl font-bold text-[#2A1A12] dark:text-white sm:text-5xl">
            {selected || t('cuisines.title', 'Explore World Cuisines')}
          </h1>
          <p className="mt-4 text-[#5A4538] dark:text-white/70">
            {selected
              ? t('cuisines.count', '{{count}} recipes', { count: filtered.length })
              : t('cuisines.subtitle', 'Discover signature dishes from every corner of the world.')}
          </p>
          {selected && (
            <button
              type="button"
              onClick={() => select('')}
              className="mt-5 rounded-lg border border-[#E8DCCB] px-5 py-2 text-sm font-semibold text-[#2A1A12] transition-colors hover:border-[#C8582A] dark:border-white/20 dark:text-white"
            >
              ← {t('cuisines.all', 'All cuisines')}
            </button>
          )}
        </header>

        {loading ? (
          <p className="py-20 text-center text-[#8A7565]">{t('cuisines.loading', 'Loading…')}</p>
        ) : selected ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {cuisines.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => select(c.name)}
                className="group relative aspect-[4/3] overflow-hidden rounded-[18px] bg-[#2A1A12] text-left"
              >
                {c.image && (
                  <img
                    src={c.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410]/85 via-[#1C1410]/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <h2 className="font-serif text-xl font-bold text-white sm:text-2xl">{c.name}</h2>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
                    {t('cuisines.count', '{{count}} recipes', { count: c.count })}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Cuisines;
