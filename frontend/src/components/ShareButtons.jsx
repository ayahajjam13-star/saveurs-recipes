import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

function ShareButtons({ recipe }) {
  const { t } = useTranslation();
  const url = `https://saveurs-recipes.vercel.app/recipe/${recipe.id}`;
  const text = `Check out this recipe: ${recipe.name}`;

  const share = async (platform) => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
    };

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        toast.success(t('share.copied'));
      } catch (err) {
        toast.error('Failed to copy');
      }
      return;
    }

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-cream/80 mr-2">
        {t('share.label')}
      </span>
      
      <button
        onClick={() => share('twitter')}
        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-[#1DA1F2] text-cream flex items-center justify-center transition-colors"
        title={t('share.twitter')}
      >
        🐦
      </button>
      
      <button
        onClick={() => share('facebook')}
        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-[#1877F2] text-cream flex items-center justify-center transition-colors"
        title={t('share.facebook')}
      >
        📘
      </button>
      
      <button
        onClick={() => share('whatsapp')}
        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-[#25D366] text-cream flex items-center justify-center transition-colors"
        title={t('share.whatsapp')}
      >
        💬
      </button>
      
      <button
        onClick={() => share('copy')}
        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-warm-brown text-cream flex items-center justify-center transition-colors"
        title={t('share.copy')}
      >
        🔗
      </button>
    </div>
  );
}

export default ShareButtons;