import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export default function PublicProfile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/users/${id}`)
      .then(res => {
        setProfile(res.data);
        setFavorites(res.data.favorites || []);
        setRatings(res.data.ratings || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/users/${id}/follow`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsFollowing(res.data.is_following);
      setProfile(prev => ({
        ...prev,
        followers_count: res.data.is_following ? prev.followers_count + 1 : prev.followers_count - 1
      }));
    } catch (err) {
      console.error(err);
      alert('خاصك تكوني مسجل الدخول باش تتابعي!');
    }
  };

  if (loading) return <div className="text-center py-32">Loading...</div>;
  if (!profile) return <div className="text-center py-32">User not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Header Card */}
      <div className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-lg border border-warm-brown/5 dark:border-dark-text/5 flex flex-col md:flex-row items-center gap-8">
        
        {/* Avatar */}
        <div className="w-32 h-32 rounded-full bg-orange-accent/20 flex items-center justify-center text-5xl font-bold text-orange-accent overflow-hidden">
          {profile.user.avatar ? (
            <img src={profile.user.avatar} alt={profile.user.name} className="w-full h-full object-cover" />
          ) : (
            profile.user.name.charAt(0).toUpperCase()
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="font-serif text-3xl font-bold text-warm-brown dark:text-dark-text mb-2">
            {profile.user.name}
          </h1>
          <p className="text-warm-brown/60 dark:text-dark-text/60 mb-4">
            {profile.user.bio || "No bio yet."}
          </p>
          
          <div className="flex items-center justify-center md:justify-start gap-6 text-sm font-medium text-warm-brown dark:text-dark-text">
            <span><strong>{profile.followers_count}</strong> Followers</span>
            <span><strong>{profile.following_count}</strong> Following</span>
          </div>
        </div>

        {/* Follow Button */}
        {currentUser && currentUser.id !== profile.user.id && (
          <button
            onClick={handleFollow}
            className={`px-6 py-3 rounded-2xl font-medium transition-all ${
              isFollowing 
                ? 'bg-gray-200 text-gray-800 dark:bg-neutral-700 dark:text-white hover:bg-gray-300' 
                : 'bg-orange-accent text-white hover:bg-orange-accent/90'
            }`}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>

      {/* Favorites Section */}
      <div className="mt-12">
        <h2 className="font-serif text-2xl font-bold text-warm-brown dark:text-dark-text mb-6">
          ❤️ Favorite Recipes
        </h2>
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favorites.map(recipe => (
              <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="bg-white dark:bg-dark-card p-4 rounded-xl flex gap-4 hover:shadow-md transition-shadow">
                <img src={`/images/${recipe.image}`} className="w-16 h-16 rounded-lg object-cover" alt={recipe.name} />
                <div>
                  <p className="font-medium text-warm-brown dark:text-dark-text">{recipe.name}</p>
                  <p className="text-sm text-warm-brown/60 dark:text-dark-text/60">{recipe.cuisine}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-warm-brown/60 dark:text-dark-text/60 italic">No favorite recipes yet.</p>
        )}
      </div>

      {/* Ratings Section */}
      <div className="mt-12">
        <h2 className="font-serif text-2xl font-bold text-warm-brown dark:text-dark-text mb-6">
          ⭐ Recent Reviews
        </h2>
        {ratings.length > 0 ? (
          <div className="space-y-4">
            {ratings.map(rating => (
              <div key={rating.id} className="bg-white dark:bg-dark-card p-4 rounded-xl">
                <Link to={`/recipe/${rating.recipe?.id}`} className="font-medium text-warm-brown dark:text-dark-text hover:underline">
                  {rating.recipe?.name}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-yellow-500 text-sm">{"⭐".repeat(rating.score)}</span>
                  <p className="text-sm text-warm-brown/80 dark:text-dark-text/80">{rating.comment || "No comment."}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-warm-brown/60 dark:text-dark-text/60 italic">No reviews yet.</p>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link to="/" className="text-orange-accent hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}