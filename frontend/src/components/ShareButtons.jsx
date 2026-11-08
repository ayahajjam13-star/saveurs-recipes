
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
  Share2,
  Copy,
  Check,
  MessageCircle,
  Facebook,
  Send,
} from 'lucide-react';
import { useState } from 'react';

function ShareButtons({ recipe }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const url = `https://saveurs-recipes.vercel.app/recipe/${recipe.id}`;
  const text = `Check out this recipe: ${recipe.name}`;

  const share = async (platform) => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,

      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,

      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    };

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success(t('share.copied'));

        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast.error('Failed to copy link');
      }

      return;
    }

    // Native sharing on supported mobile devices
    if (platform === 'native') {
      if (navigator.share) {
        try {
          await navigator.share({
            title: recipe.name,
            text,
            url,
          });
        } catch (error) {
          if (error.name !== 'AbortError') {
            toast.error('Unable to share this recipe');
          }
        }
      } else {
        await share('copy');
      }

      return;
    }

    window.open(
      urls[platform],
      '_blank',
      'noopener,noreferrer,width=600,height=500'
    );
  };

  const buttons = [
    {
      id: 'twitter',
      icon: <Send size={17} />,
      label: t('share.twitter'),
      hover: 'hover:bg-[#1DA1F2]',
    },
    {
      id: 'facebook',
      icon: <Facebook size={18} />,
      label: t('share.facebook'),
      hover: 'hover:bg-[#1877F2]',
    },
    {
      id: 'whatsapp',
      icon: <MessageCircle size={18} />,
      label: t('share.whatsapp'),
      hover: 'hover:bg-[#25D366]',
    },
    {
      id: 'copy',
      icon: copied ? <Check size={18} /> : <Copy size={17} />,
      label: t('share.copy'),
      hover: 'hover:bg-[#718B68]',
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2.5">

      {/* Share Label */}
      <span className="flex items-center gap-2 mr-1 text-sm font-medium text-[#8B8179]">
        <Share2 size={16} className="text-[#E88FA5]" />
        {t('share.label')}
      </span>

      {/* Share Buttons */}
      {buttons.map((button) => (
        <button
          key={button.id}
          type="button"
          onClick={() => share(button.id)}
          title={button.label}
          aria-label={button.label}
          className={`
            flex h-10 w-10 items-center justify-center
            rounded-full
            bg-[#FAF7F0]
            border border-[#EEE7DF]
            text-[#51453D]
            ${button.hover}
            hover:text-white hover:border-transparent
            hover:-translate-y-1 hover:shadow-md
            active:scale-95
            transition-all duration-200
          `}
        >
          {button.icon}
        </button>
      ))}

      {/* Native Share */}
      {'share' in navigator && (
        <button
          type="button"
          onClick={() => share('native')}
          title="More sharing options"
          aria-label="More sharing options"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E88FA5]/10 border border-[#E88FA5]/20 text-[#D77F96] hover:bg-[#E88FA5] hover:text-white hover:-translate-y-1 transition-all duration-200"
        >
          <Share2 size={17} />
        </button>
      )}

    </div>
  );
}

export default ShareButtons;
