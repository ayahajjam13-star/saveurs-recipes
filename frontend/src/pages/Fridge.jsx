import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, X, Refrigerator, ChefHat, CheckCircle2 } from 'lucide-react';

import SEO from '../components/SEO';
import { findByFridge } from '../services/api';

// المكونات الشائعة: key = بالإنجليزية (كيتصيفط للـ backend)
const QUICK = [
  { key: 'tomato', emoji: '🍅', en: 'Tomato', fr: 'Tomate', ar: 'طماطم' },
  { key: 'onion', emoji: '🧅', en: 'Onion', fr: 'Oignon', ar: 'بصلة' },
  { key: 'garlic', emoji: '🧄', en: 'Garlic', fr: 'Ail', ar: 'ثوم' },
  { key: 'potato', emoji: '🥔', en: 'Potato', fr: 'Pomme de terre', ar: 'بطاطس' },
  { key: 'carrot', emoji: '🥕', en: 'Carrot', fr: 'Carotte', ar: 'جزر' },
  { key: 'egg', emoji: '🥚', en: 'Egg', fr: 'Œuf', ar: 'بيض' },
  { key: 'chicken', emoji: '🍗', en: 'Chicken', fr: 'Poulet', ar: 'دجاج' },
  { key: 'beef', emoji: '🥩', en: 'Beef', fr: 'Bœuf', ar: 'لحم' },
  { key: 'fish', emoji: '🐟', en: 'Fish', fr: 'Poisson', ar: 'سمك' },
  { key: 'rice', emoji: '🍚', en: 'Rice', fr: 'Riz', ar: 'أرز' },
  { key: 'pasta', emoji: '🍝', en: 'Pasta', fr: 'Pâtes', ar: 'معكرونة' },
  { key: 'cheese', emoji: '🧀', en: 'Cheese', fr: 'Fromage', ar: 'جبن' },
  { key: 'milk', emoji: '🥛', en: 'Milk', fr: 'Lait', ar: 'حليب' },
  { key: 'butter', emoji: '🧈', en: 'Butter', fr: 'Beurre', ar: 'زبدة' },
  { key: 'lemon', emoji: '🍋', en: 'Lemon', fr: 'Citron', ar: 'ليمون' },
  { key: 'zucchini', emoji: '🥒', en: 'Zucchini', fr: 'Courgette', ar: 'كوسة' },
  { key: 'mushroom', emoji: '🍄', en: 'Mushroom', fr: 'Champignon', ar: 'فطر' },
  { key: 'lentil', emoji: '🫘', en: 'Lentils', fr: 'Lentilles', ar: 'عدس' },
  { key: 'chickpea', emoji: '🧆', en: 'Chickpeas', fr: 'Pois chiches', ar: 'حمص' },
  { key: 'flour', emoji: '🌾', en: 'Flour', fr: 'Farine', ar: 'دقيق' },
];

const FILTERS = ['all', 'ready', 'almost'];

function Fridge() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || 'en').slice(0, 2);
  const labelOf = (item) => item[lang] || item.en;

  const [tags, setTags] = useState([]); // [{ value, label }]
  const [input, setInput] = useState('');
  const [assumeStaples, setAssumeStaples] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const requestId = useRef(0);

  const addTag = (value, label) => {
    const v = value.trim();
    if (!v) return;
    setTags((prev) =>
      prev.some((x) => x.value.toLowerCase() === v.toLowerCase())
        ? prev
        : [...prev, { value: v, label: label || v }]
    );
    setInput('');
  };

  const removeTag = (value) =>
    setTags((prev) => prev.filter((x) => x.value !== value));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === '،') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  // بحث أوتوماتيكي كل ما تبدلات المكونات (مع تأخير صغير)
  useEffect(() => {
    if (tags.length === 0) {
      setRecipes([]);
      setError('');
      return undefined;
    }

    const id = ++requestId.current;
    setLoading(true);
    setError('');

    const timer = setTimeout(async () => {
      try {
        const res = await findByFridge(tags.map((x) => x.value), assumeStaples);
        if (id === requestId.current) {
          setRecipes(res.data.recipes || []);
        }
      } catch (err) {
        if (id === requestId.current) {
          setError(t('fridge.error', 'Something went wrong. Please try again.'));
        }
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [tags, assumeStaples, t]);

  const visible = useMemo(() => {
    if (filter === 'ready') return recipes.filter((r) => r.can_cook);
    if (filter === 'almost') return recipes.filter((r) => r.missing.length > 0 && r.missing.length <= 2);
    return recipes;
  }, [recipes, filter]);

  const imageUrl = (img) =>
    img?.startsWith('http') ? img : img ? `/images/${img}` : null;

  return (
    <div className="min-h-screen bg-[#FAF6EF] dark:bg-[#1C1410]" dir={i18n.dir()}>
      <SEO
        title={t('fridge.title', "What's in your fridge?")}
        description={t('fridge.subtitle', 'Tell us what you have and discover what you can cook right now.')}
      />

      <div className="max-w-6xl mx-auto px-5 py-12 md:py-16">
        {/* Header */}
        <header className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#C8582A]/20 text-[#A8441F] dark:text-[#E08A5F] mb-5">
            <Refrigerator size={28} />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#2A1A12] dark:text-white">
            {t('fridge.title', "What's in your fridge?")}
          </h1>
          <p className="mt-4 text-[#5A4538] dark:text-white/70">
            {t('fridge.subtitle', 'Tell us what you have and discover what you can cook right now.')}
          </p>
        </header>

        {/* Input card */}
        <section className="mt-10 max-w-3xl mx-auto rounded-[18px] bg-white dark:bg-[#2A1A12] border border-[#E8DCCB] dark:border-white/10 p-5 md:p-7 shadow-[0_8px_28px_rgba(89,68,61,0.07)]">
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#E8DCCB] dark:border-white/15 px-3 py-2 focus-within:border-[#C8582A] transition-colors">
            {tags.map((tag) => (
              <span
                key={tag.value}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#EADFC8] text-[#2A1A12] pl-3 pr-1.5 py-1 text-sm"
              >
                {tag.label}
                <button
                  type="button"
                  onClick={() => removeTag(tag.value)}
                  aria-label={`${t('fridge.remove', 'Remove')} ${tag.label}`}
                  className="w-5 h-5 rounded-full hover:bg-black/10 flex items-center justify-center"
                >
                  <X size={13} />
                </button>
              </span>
            ))}

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                tags.length
                  ? t('fridge.addMore', 'Add another ingredient…')
                  : t('fridge.placeholder', 'Type an ingredient and press Enter (tomato, egg, طماطم…)')
              }
              className="flex-1 min-w-[180px] bg-transparent outline-none py-2 text-[#2A1A12] dark:text-white placeholder:text-[#8A7565]"
            />

            <button
              type="button"
              onClick={() => addTag(input)}
              disabled={!input.trim()}
              aria-label={t('fridge.add', 'Add')}
              className="w-9 h-9 rounded-full bg-[#A8441F] text-white flex items-center justify-center disabled:opacity-40"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Quick picks */}
          <p className="mt-5 mb-2 text-xs font-semibold uppercase tracking-wider text-[#8A7565]">
            {t('fridge.quick', 'Quick add')}
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK.map((item) => {
              const active = tags.some((x) => x.value === item.key);
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() =>
                    active ? removeTag(item.key) : addTag(item.key, labelOf(item))
                  }
                  className={`rounded-full px-3 py-1.5 text-sm border transition-colors ${
                    active
                      ? 'bg-[#A8441F] text-white border-[#A8441F]'
                      : 'bg-white dark:bg-transparent text-[#2A1A12] dark:text-white border-[#E8DCCB] dark:border-white/15 hover:border-[#C8582A]'
                  }`}
                >
                  {labelOf(item)}
                </button>
              );
            })}
          </div>

          {/* Staples */}
          <label className="mt-5 flex items-center gap-2 text-sm text-[#5A4538] dark:text-white/70 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={assumeStaples}
              onChange={(e) => setAssumeStaples(e.target.checked)}
              className="accent-[#A8441F] w-4 h-4"
            />
            {t('fridge.staples', 'I always have salt, pepper, oil and water')}
          </label>
        </section>

        {/* Results */}
        <section className="mt-12">
          {tags.length === 0 && (
            <p className="text-center text-[#8A7565]">
              {t('fridge.empty', 'Add at least one ingredient to see recipes.')}
            </p>
          )}

          {tags.length > 0 && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h2 className="font-serif text-2xl font-bold text-[#2A1A12] dark:text-white">
                  {loading
                    ? t('fridge.searching', 'Searching…')
                    : t('fridge.found', '{{count}} recipes found', { count: visible.length })}
                </h2>

                <div className="flex gap-2">
                  {FILTERS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFilter(f)}
                      className={`rounded-full px-4 py-1.5 text-sm border transition-colors ${
                        filter === f
                          ? 'bg-[#C8582A] text-white border-[#C8582A]'
                          : 'bg-white dark:bg-transparent text-[#2A1A12] dark:text-white border-[#E8DCCB] dark:border-white/15'
                      }`}
                    >
                      {f === 'all' && t('fridge.filterAll', 'All')}
                      {f === 'ready' && t('fridge.filterReady', 'Ready to cook')}
                      {f === 'almost' && t('fridge.filterAlmost', 'Missing 1–2')}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-center text-[#A8683A]">{error}</p>}

              {!loading && !error && visible.length === 0 && (
                <div className="text-center py-10 text-[#8A7565]">
                  <ChefHat className="mx-auto mb-3" size={32} />
                  {t('fridge.none', 'No recipes match yet. Try adding more ingredients.')}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((r) => {
                  const img = imageUrl(r.image);
                  return (
                    <Link
                      key={r.id}
                      to={`/recipe/${r.id}`}
                      className="group overflow-hidden rounded-[18px] bg-white dark:bg-[#2A1A12] border border-[#E8DCCB] dark:border-white/10 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(156,114,99,0.17)] transition-all duration-300"
                    >
                      <div className="aspect-[16/10] bg-[#FAF6EF] overflow-hidden">
                        {img && (
                          <img
                            src={img}
                            alt={r.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>

                      <div className="p-5">
                        <p className="text-xs uppercase tracking-wider text-[#8A7565]">
                          {r.cuisine} · {r.country}
                        </p>
                        <h3 className="mt-1 font-serif text-xl font-bold text-[#2A1A12] dark:text-white leading-snug">
                          {r.name}
                        </h3>

                        {/* Progress */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm mb-1.5">
                            <span className="font-semibold text-[#A8441F] dark:text-[#E08A5F]">
                              {t('fridge.have', 'You have {{have}}/{{total}}', { have: r.have, total: r.total })}
                            </span>
                            <span className="text-[#8A7565]">{r.percent}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-[#FAF6EF] dark:bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#E08A5F] to-[#C8582A]"
                              style={{ width: `${r.percent}%` }}
                            />
                          </div>
                        </div>

                        {r.can_cook ? (
                          <p className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[#A8441F] dark:text-[#E08A5F]">
                            <CheckCircle2 size={16} />
                            {t('fridge.canCook', 'You can cook this now!')}
                          </p>
                        ) : (
                          <p className="mt-4 text-sm text-[#5A4538] dark:text-white/70">
                            <span className="font-semibold">{t('fridge.missing', 'Missing:')}</span>{' '}
                            {r.missing.slice(0, 3).join(' · ')}
                            {r.missing.length > 3 &&
                              ` · +${r.missing.length - 3}`}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Fridge;
