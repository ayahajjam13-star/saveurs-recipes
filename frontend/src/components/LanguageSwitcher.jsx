
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
    <div className="flex items-center gap-2">
      {languages.map((lang) => {
        const isActive = i18n.language.startsWith(lang.code);

        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => changeLanguage(lang.code)}
            aria-label={`Change language to ${lang.label}`}
            aria-pressed={isActive}
            className={`
              flex items-center gap-2 rounded-xl border px-3 py-2
              text-xs font-semibold transition-all duration-300
              ${
                isActive
                  ? 'border-[#E88FA5] bg-[#E88FA5] text-white shadow-md shadow-[#E88FA5]/20'
                  : 'border-[#E8DFD7] bg-[#FFFEFC] text-[#51453D] hover:border-[#E88FA5] hover:bg-[#E88FA5]/10 dark:border-[#51453D] dark:bg-[#28221E] dark:text-[#FAF7F0]'
              }
            `}
          >
            <span className="text-base">{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default LanguageSwitcher;
