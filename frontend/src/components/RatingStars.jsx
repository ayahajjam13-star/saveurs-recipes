
import { Star } from 'lucide-react';

function RatingStars({
  rating = 0,
  size = 'md',
  interactive = false,
  onRate = null,
}) {
  const sizes = {
    sm: 'w-[13px] h-[13px]',
    md: 'w-[21px] h-[21px]',
    lg: 'w-[32px] h-[32px]',
  };

  const handleClick = (value) => {
    if (interactive && onRate) {
      onRate(value);
    }
  };

  return (
    <div
      className={`rating-stars ${interactive ? 'rating-stars-interactive' : ''}`}
      role={interactive ? 'group' : 'img'}
      aria-label={`Rating: ${rating} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= rating;

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(star)}
            aria-label={`Rate ${star} out of 5`}
            aria-pressed={interactive ? rating === star : undefined}
            className={`rating-star-button ${isActive ? 'active' : ''}`}
          >
            <Star
              className={sizes[size] || sizes.md}
              fill={isActive ? 'currentColor' : 'none'}
              strokeWidth={isActive ? 1.8 : 1.6}
            />
          </button>
        );
      })}
    </div>
  );
}

export default RatingStars;
