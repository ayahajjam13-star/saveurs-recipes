
import RatingStars from './RatingStars';
import { UserRound, CalendarDays, MessageSquare, Sparkles } from 'lucide-react';
import './RatingList.css';

function RatingList({ ratings }) {
  if (!ratings || ratings.length === 0) {
    return (
      <div className="rating-empty-state">
        <div className="rating-empty-icon">
          <Sparkles size={25} />
        </div>

        <h3>No Reviews Yet</h3>

        <p>
          Be the first to share your experience and help
          others discover this recipe!
        </p>
      </div>
    );
  }

  return (
    <div className="rating-list">
      <div className="rating-list-heading">
        <div>
          <h3>Community Reviews</h3>
          <p>
            {ratings.length} {ratings.length === 1 ? 'review' : 'reviews'}
            {' '}from our food lovers
          </p>
        </div>

        <div className="rating-list-badge">
          <Sparkles size={15} />
          Reviews
        </div>
      </div>

      <div className="rating-list-items">
        {ratings.map((rating) => {
          const date = rating.created_at
            ? new Date(rating.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : 'Date unavailable';

          return (
            <article key={rating.id} className="rating-review-card">
              {/* User information */}
              <div className="rating-review-header">
                <div className="rating-review-avatar">
                  <UserRound size={19} />
                </div>

                <div className="rating-review-user">
                  <h4>{rating.user?.name || 'Anonymous'}</h4>

                  <div className="rating-review-date">
                    <CalendarDays size={12} />
                    <span>{date}</span>
                  </div>
                </div>

                <div className="rating-review-score">
                  <RatingStars rating={rating.score} size="sm" />
                </div>
              </div>

              {/* Comment */}
              {rating.comment ? (
                <div className="rating-review-comment">
                  <MessageSquare size={14} />
                  <p>{rating.comment}</p>
                </div>
              ) : (
                <p className="rating-no-comment">
                  Rated without a comment.
                </p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default RatingList;
