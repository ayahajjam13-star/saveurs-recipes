import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'fr', label: 'FR', flag: '🇫🇷' },
    { code: 'ar', label: 'AR', flag: '🇸🇦' },
  ];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = code;
  };

  return (
    <div className="flex gap-1">
      {languages.map(lang => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
            i18n.language === lang.code
              ? 'bg-orange-accent text-white'
              : 'text-warm-brown dark:text-dark-text hover:bg-cream dark:hover:bg-dark-bg'
          }`}
        >
          {lang.flag} {lang.label}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;