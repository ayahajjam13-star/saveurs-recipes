import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import RatingStars from './RatingStars';

const API_URL = 'http://127.0.0.1:8000/api';

function RatingForm({ recipeId, onRatingChange }) {
  const { user } = useAuth();
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [existingRating, setExistingRating] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if user already rated
  useEffect(() => {
    if (user) {
      axios.get(`${API_URL}/ratings/check/${recipeId}`)
        .then(res => {
          if (res.data.has_rated) {
            setExistingRating(res.data.rating);
            setScore(res.data.rating.score);
            setComment(res.data.rating.comment || '');
          }
        })
        .catch(err => console.error(err));
    }
  }, [recipeId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to rate');
      return;
    }

    if (score === 0) {
      toast.error('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/ratings`, {
        recipe_id: recipeId,
        score,
        comment,
      });
      toast.success(existingRating ? 'Rating updated!' : 'Thanks for your rating!');
      if (onRatingChange) onRatingChange();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save rating');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/ratings/${recipeId}`);
      setScore(0);
      setComment('');
      setExistingRating(null);
      toast.success('Rating removed');
      if (onRatingChange) onRatingChange();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete rating');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-warm-brown/5 dark:border-dark-text/5 text-center transition-colors">
        <p className="text-warm-brown/60 dark:text-dark-text/60 mb-3">
          🔒 Login to rate this recipe
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-warm-brown/5 dark:border-dark-text/5 transition-colors">
      <h3 className="font-serif text-xl font-bold text-warm-brown dark:text-dark-text mb-4">
        {existingRating ? '⭐ Update your rating' : '⭐ Rate this recipe'}
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-warm-brown dark:text-dark-text mb-2">
          Your rating
        </label>
        <RatingStars rating={score} size="lg" interactive onRate={setScore} />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-warm-brown dark:text-dark-text mb-2">
          Comment (optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Share your experience with this recipe..."
          className="w-full px-4 py-3 rounded-xl border border-warm-brown/10 dark:border-dark-text/10 bg-cream/50 dark:bg-dark-bg/50 text-warm-brown dark:text-dark-text focus:outline-none focus:border-orange-accent transition-colors resize-none"
        />
        <p className="text-xs text-warm-brown/50 dark:text-dark-text/50 mt-1">
          {comment.length}/500
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || score === 0}
          className="flex-1 py-3 bg-orange-accent text-white rounded-xl font-medium hover:bg-orange-accent/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : existingRating ? 'Update Rating' : 'Submit Rating'}
        </button>
        {existingRating && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-6 py-3 bg-red-500/10 text-red-500 rounded-xl font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}

export default RatingForm;