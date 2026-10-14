import RatingStars from './RatingStars';

function RatingList({ ratings }) {
  if (!ratings || ratings.length === 0) {
    return (
      <div className="text-center py-8 text-warm-brown/60 dark:text-dark-text/60">
        <p className="text-4xl mb-2">💬</p>
        <p>No reviews yet. Be the first to rate!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ratings.map((rating) => (
        <div
          key={rating.id}
          className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-warm-brown/5 dark:border-dark-text/5 transition-colors"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-accent/10 rounded-full flex items-center justify-center text-warm-brown dark:text-dark-text font-bold">
                {rating.user?.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <p className="font-medium text-warm-brown dark:text-dark-text">
                  {rating.user?.name || 'Anonymous'}
                </p>
                <p className="text-xs text-warm-brown/50 dark:text-dark-text/50">
                  {new Date(rating.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <RatingStars rating={rating.score} size="sm" />
          </div>
          {rating.comment && (
            <p className="text-warm-brown/80 dark:text-dark-text/80 mt-3 leading-relaxed">
              "{rating.comment}"
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default RatingList;