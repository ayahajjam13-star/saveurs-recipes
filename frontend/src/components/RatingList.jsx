
import RatingStars from './RatingStars';
import {
  UserRound,
  CalendarDays,
  MessageSquare,
  Sparkles,
  Heart,
  Star,
} from 'lucide-react';
import './RatingList.css';

function RatingList({ ratings }) {
  if (!ratings || ratings.length === 0) {
    return (
      <div className="rating-empty-state">
        <div className="rating-empty-decoration">
          <Heart size={19} />
        </div>

        <div className="rating-empty-icon">
          <Sparkles size={26} />
        </div>

        <span className="rating-empty-eyebrow">
          BE THE FIRST
        </span>

        <h3>No Reviews Yet</h3>

        <p>
          Be the first to share your experience and help
          others discover this recipe!
        </p>

        <div className="rating-empty-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={17} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rating-list">

      {/* Header */}
      <div className="rating-list-heading">
        <div className="rating-list-heading-main">
          <div className="rating-list-heading-icon">
            <MessageSquare size={20} />
          </div>

          <div>
            <span className="rating-list-eyebrow">
              WHAT PEOPLE THINK
            </span>

            <h3>Community Reviews</h3>

            <p>
              {ratings.length} {ratings.length === 1 ? 'review' : 'reviews'}
              {' '}from our food lovers
            </p>
          </div>
        </div>

        <div className="rating-list-badge">
          <Sparkles size={14} />
          Community
        </div>
      </div>

      {/* Reviews */}
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
                  <UserRound size={21} />
                </div>

                <div className="rating-review-user">
                  <h4>{rating.user?.name || 'Anonymous'}</h4>

                  <div className="rating-review-date">
                    <CalendarDays size={13} />
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
                  <div className="rating-comment-icon">
                    <MessageSquare size={15} />
                  </div>

                  <p>{rating.comment}</p>
                </div>
              ) : (
                <p className="rating-no-comment">
                  Rated without a comment.
                </p>
              )}

              <div className="rating-review-footer">
                <Heart size={12} />
                <span>Shared with the Saveurs community</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default RatingList;
