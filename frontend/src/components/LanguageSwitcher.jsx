import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = code;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {languages.map((lang) => {
        const isActive = i18n.language?.startsWith(lang.code);

        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => changeLanguage(lang.code)}
            aria-label={`Change language to ${lang.label}`}
            aria-pressed={isActive}
            className={`
              flex items-center justify-center gap-1.5
              rounded-full border px-3 py-2
              text-xs font-bold transition-all duration-300
              ${
                isActive
                  ? 'border-[#EB9D81] bg-[#EB9D81] text-[#5A3325] shadow-md'
                  : 'border-[#EDC7B9] bg-white text-[#864F3B] hover:bg-[#EDC7B9] dark:border-white/10 dark:bg-white/5 dark:text-[#EDC7B9] dark:hover:bg-white/10'
              }
            `}
          >
            <span className="text-sm">{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default LanguageSwitcher;