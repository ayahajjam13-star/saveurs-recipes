import { useState } from 'react';
import { Star } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

function RatingForm({ recipeId, onRatingChange }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (score === 0) return;
    setLoading(true);

    try {
      await axios.post(`${API_URL}/ratings`, {
        recipe_id: recipeId,
        score,
        comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setScore(0);
      setComment('');
      onRatingChange();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="text-center p-6 bg-[#FAF7F0] rounded-xl border border-warm-brown/5 font-sans">
        <p className="text-gray-500 text-sm">Please log in to rate this recipe.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans">
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setScore(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              size={32}
              className={`${
                star <= (hover || score) ? 'fill-guava-pink text-guava-pink' : 'text-gray-300'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a review (optional)..."
        className="w-full p-4 rounded-xl border border-gray-200 bg-white text-warm-brown focus:outline-none focus:ring-2 focus:ring-guava-pink/30 transition-all resize-none text-sm"
        rows={3}
      />
      <button
        type="submit"
        disabled={loading || score === 0}
        className="w-full py-3 bg-warm-brown text-white rounded-full text-sm font-bold tracking-widest uppercase hover:bg-guava-pink transition-colors disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

export default RatingForm;