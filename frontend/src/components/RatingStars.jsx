function RatingStars({ rating = 0, size = 'md', interactive = false, onRate = null }) {
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
    <div className={`flex gap-1 ${sizes[size]} ${interactive ? 'cursor-pointer' : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => handleClick(star)}
          className={`transition-transform ${interactive ? 'hover:scale-125' : ''}`}
        >
          <span className={star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

export default RatingStars;