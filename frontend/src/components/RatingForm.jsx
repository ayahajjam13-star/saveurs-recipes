
import { useState } from 'react';
import { Star, Send, MessageSquare, Lock, Sparkles } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './RatingForm.css';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function RatingForm({ recipeId, onRatingChange }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const ratingLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent!',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (score === 0) {
      toast.error('Please select a rating first.');
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${API_URL}/ratings`,
        {
          recipe_id: recipeId,
          score,
          comment: comment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setScore(0);
      setHover(0);
      setComment('');

      toast.success('Thank you! Your review has been submitted.');

      if (typeof onRatingChange === 'function') {
        await onRatingChange();
      }
    } catch (err) {
      console.error('Rating submission error:', err);

      toast.error(
        err.response?.data?.message ||
        'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="rating-login-card">
        <div className="rating-login-icon">
          <Lock size={22} />
        </div>

        <h3>Share Your Experience</h3>

        <p>
          Join our community to rate recipes and share your
          thoughts with other food lovers.
        </p>

        <a href="/login" className="rating-login-link">
          Log in to Rate
          <Send size={15} />
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rating-form">
      <div className="rating-form-heading">
        <div className="rating-heading-icon">
          <Sparkles size={18} />
        </div>

        <div>
          <h3>Rate This Recipe</h3>
          <p>Your opinion makes our community better.</p>
        </div>
      </div>

      {/* Stars */}
      <div className="rating-stars-section">
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => {
            const active = star <= (hover || score);

            return (
              <button
                key={star}
                type="button"
                onClick={() => setScore(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onFocus={() => setHover(star)}
                onBlur={() => setHover(0)}
                className={`rating-star-button ${
                  active ? 'active' : ''
                }`}
                aria-label={`Rate ${star} out of 5 stars`}
                aria-pressed={score === star}
              >
                <Star
                  size={34}
                  fill={active ? 'currentColor' : 'none'}
                  strokeWidth={1.8}
                />
              </button>
            );
          })}
        </div>

        <p className="rating-selected-label">
          {score > 0
            ? `${score}/5 — ${ratingLabels[score]}`
            : 'Select your rating'}
        </p>
      </div>

      {/* Comment */}
      <div className="rating-comment-section">
        <label htmlFor="rating-comment">
          <MessageSquare size={15} />
          Your Review
          <span>Optional</span>
        </label>

        <textarea
          id="rating-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you think about this recipe? Share your experience..."
          rows={4}
          maxLength={1000}
        />

        <div className="rating-character-count">
          {comment.length}/1000
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || score === 0}
        className="rating-submit-button"
      >
        {loading ? (
          <>
            <span className="rating-spinner" />
            Submitting...
          </>
        ) : (
          <>
            Submit Review
            <Send size={17} />
          </>
        )}
      </button>

      <p className="rating-form-note">
        <Lock size={12} />
        Your review will be shared with the Saveurs community.
      </p>
    </form>
  );
}

export default RatingForm;
