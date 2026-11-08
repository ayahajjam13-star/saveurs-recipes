
function RatingStars({
  rating = 0,
  size = 'md',
  interactive = false,
  onRate = null,
}) {
  const sizes = {
    sm: 'text-base',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const handleClick = (value) => {
    if (interactive && onRate) {
      onRate(value);
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-1 ${sizes[size] || sizes.md}`}
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
            className={`
              leading-none border-0 bg-transparent p-0
              transition-all duration-200
              ${interactive
                ? 'cursor-pointer hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88FA5] rounded-sm'
                : 'cursor-default'
              }
            `}
          >
            <span
              className={`
                inline-block transition-colors duration-200
                ${isActive
                  ? 'text-[#E88FA5] drop-shadow-[0_1px_2px_rgba(232,143,165,0.25)]'
                  : 'text-[#DED8D1]'
                }
              `}
            >
              ★
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default RatingStars;
