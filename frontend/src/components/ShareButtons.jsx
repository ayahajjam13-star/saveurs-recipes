
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import './ShareButtons.css';

import {
  Share2,
  Copy,
  Check,
  MessageCircle,
  Facebook,
  Send,
} from 'lucide-react';

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
      className: 'share-twitter',
    },
    {
      id: 'facebook',
      icon: <Facebook size={18} />,
      label: t('share.facebook'),
      className: 'share-facebook',
    },
    {
      id: 'whatsapp',
      icon: <MessageCircle size={18} />,
      label: t('share.whatsapp'),
      className: 'share-whatsapp',
    },
    {
      id: 'copy',
      icon: copied ? <Check size={18} /> : <Copy size={17} />,
      label: t('share.copy'),
      className: 'share-copy',
      copied,
    },
  ];

  return (
    <div className="saveurs-share">

      {/* Share Heading */}
      <div className="saveurs-share-heading">
        <div className="saveurs-share-icon">
          <Share2 size={17} />
        </div>

        <span>{t('share.label')}</span>
      </div>

      {/* Social Buttons */}
      <div className="saveurs-share-actions">
        {buttons.map((button) => (
          <button
            key={button.id}
            type="button"
            onClick={() => share(button.id)}
            title={button.label}
            aria-label={button.label}
            className={`saveurs-share-button ${button.className} ${
              button.copied ? 'is-copied' : ''
            }`}
          >
            {button.icon}
            <span className="saveurs-share-tooltip">
              {button.label}
            </span>
          </button>
        ))}

        {/* Native Share */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            type="button"
            onClick={() => share('native')}
            title="More sharing options"
            aria-label="More sharing options"
            className="saveurs-share-button share-native"
          >
            <Share2 size={17} />
            <span className="saveurs-share-tooltip">
              More options
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export default ShareButtons;
